import Controller from "sap/ui/core/mvc/Controller";
import MyDialogHanlder, { MyDialogHandler$SubmitEvent } from "miyasuta/library/controller/MyDialogHandler";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace miyasuta.consumerapp.controller
 */
export default class View1 extends Controller {

    public onInit(): void {

    }

    public onPressMeButtonPress(): void {
        const dialogHandler = new MyDialogHanlder();
        dialogHandler.attachSubmit((event: MyDialogHandler$SubmitEvent) => {
            const message = event.getParameter("message");
            MessageToast.show(`Dialog submitted with message: ${message}`);
        });
        dialogHandler.open();
    }  
}