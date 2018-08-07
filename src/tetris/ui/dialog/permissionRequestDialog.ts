import Dialog from "tetris/ui/dialog/dialog";

export default class PermissionRequestDialog extends Dialog {

	//region public members
	//endregion

	//region public methods
	//endregion

	//region constructor
	public static displayCameraPermissionRequest(): PermissionRequestDialog {
		const dialog = new PermissionRequestDialog("permission-dialog", "Would you like to add a profile photo?");
		dialog.title = "Take a Selfie";
		dialog._addAcceptElements();
		dialog._addRejectElements();
		return dialog.show() as PermissionRequestDialog;
	}

	protected constructor(dialogId: string, prompt: string) {
		super(dialogId, false);
		let htmlPrompt = this._htmlElement.querySelector("#prompt") as HTMLParagraphElement;
		htmlPrompt.innerHTML = prompt;
	}
	//endregion

	//region private members
	//endregion

	//region private methods
	//endregion
}