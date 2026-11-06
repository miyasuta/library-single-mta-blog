export default {
	name: "QUnit TestSuite for miyasuta.library",
	defaults: {
		ui5: {
			libs: ["sap.ui.core", "sap.m", "sap.ui.layout", "miyasuta.library"],
			theme: "sap_horizon"
		},
		qunit: {
			version: 2,
			reorder: false
		},
		sinon: {
			version: 4,
			qunitBridge: true,
			useFakeTimers: false
		}
	},
	tests: {
		"controller/MyDialogHandler": {
			title: "QUnit Test for MyDialogHandler"
		}
	}
};
