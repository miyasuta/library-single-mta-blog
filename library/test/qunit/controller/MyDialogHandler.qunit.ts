/* eslint-disable @typescript-eslint/no-misused-promises -- QUnit supports async test callbacks */
import Dialog from "sap/m/Dialog";
import Input from "sap/m/Input";
import Element from "sap/ui/core/Element";
import Fragment from "sap/ui/core/Fragment";
import MyDialogHandler, { MyDialogHandler$SubmitEvent } from "miyasuta/library/controller/MyDialogHandler";

type LoadOptions = Parameters<typeof Fragment.load>[0];
type HandlerInternals = { _model: { getData(): { message: string } } };

const originalLoad = Fragment.load.bind(Fragment);
let handler: MyDialogHandler;
let loadedDialog: Promise<Dialog>;

/**
 * Calls handler.open() and resolves with the dialog once it is fully opened.
 * open() returns void, so the Fragment.load promise is captured via a wrapper.
 */
async function openDialog(): Promise<Dialog> {
	handler.open();
	const dialog = await loadedDialog;
	await new Promise<void>((resolve) => {
		dialog.attachEventOnce("afterOpen", () => resolve());
	});
	return dialog;
}

function getInput(): Input {
	return Element.getElementById("messageInput") as Input;
}

QUnit.module("miyasuta.library.controller.MyDialogHandler", {
	beforeEach: function () {
		loadedDialog = undefined;
		Fragment.load = (options: LoadOptions) => {
			const promise = originalLoad(options);
			loadedDialog = promise as Promise<Dialog>;
			return promise;
		};
		handler = new MyDialogHandler();
	},
	afterEach: function () {
		handler.close();
		handler.destroy();
		Fragment.load = originalLoad;
	}
});

QUnit.test("openShouldShowDialogWithMessageInput", async function (assert) {
	assert.expect(3);

	// Act
	const dialog = await openDialog();

	// Assert
	assert.ok(dialog.isOpen(), "dialog is open");
	assert.strictEqual(dialog.getId(), "myCustomDialog", "the fragment dialog is shown");
	assert.ok(getInput(), "message input exists");
});

QUnit.test("openShouldBindInputToDialogModelUnderUserInput", async function (assert) {
	assert.expect(2);

	// Arrange
	const dialog = await openDialog();
	assert.strictEqual(dialog.getModel("dialogModel").getProperty("/message"), "", "model starts empty");

	// Act
	getInput().setValue("hello");

	// Assert
	assert.strictEqual(dialog.getModel("dialogModel").getProperty("/message"), "hello", "model reflects the input");
});

QUnit.test("submitShouldFireSubmitEventWithMessage", async function (assert) {
	assert.expect(2);

	// Arrange
	const messages: string[] = [];
	handler.attachSubmit((event: MyDialogHandler$SubmitEvent) => {
		messages.push(event.getParameter("message"));
	});
	const dialog = await openDialog();
	getInput().setValue("hello");

	// Act
	dialog.getBeginButton().firePress();

	// Assert
	assert.strictEqual(messages.length, 1, "submit fired once");
	assert.strictEqual(messages[0], "hello", "submit carries the entered message");
});

QUnit.test("submitShouldCloseAndDestroyDialog", async function (assert) {
	assert.expect(2);

	// Arrange
	const dialog = await openDialog();

	// Act
	dialog.getBeginButton().firePress();

	// Assert
	assert.strictEqual(Element.getElementById("myCustomDialog"), undefined, "dialog is destroyed");
	assert.strictEqual((handler as unknown as HandlerInternals)._model.getData().message, "", "model is reset");
});

QUnit.test("closeShouldDestroyDialogAndResetModelUnderCloseButton", async function (assert) {
	assert.expect(2);

	// Arrange
	const dialog = await openDialog();
	getInput().setValue("discard me");

	// Act
	dialog.getEndButton().firePress();

	// Assert
	assert.strictEqual(Element.getElementById("myCustomDialog"), undefined, "dialog is destroyed");
	assert.strictEqual((handler as unknown as HandlerInternals)._model.getData().message, "", "model is reset");
});

QUnit.test("closeShouldNotThrowBeforeOpen", function (assert) {
	assert.expect(1);

	// Act & Assert
	assert.ok(() => handler.close() === undefined, "close without open is a no-op");
	handler.close();
});

QUnit.test("detachSubmitShouldStopNotifications", async function (assert) {
	assert.expect(1);

	// Arrange
	let calls = 0;
	const listener = () => {
		calls++;
	};
	handler.attachSubmit(listener);
	handler.detachSubmit(listener);
	const dialog = await openDialog();

	// Act
	dialog.getBeginButton().firePress();

	// Assert
	assert.strictEqual(calls, 0, "detached listener is not called");
});
