import Dialog from "tetris/ui/dialog/dialog";

export default class EvaluationDialog extends Dialog {

	//region public members
	//endregion

	//region public methods
	//endregion

	//region constructor
	public static display(): EvaluationDialog {
		const dialog = new EvaluationDialog('evaluation-dialog');
		dialog.title = "Evaluate your player profile";
		dialog._addAcceptElements();
		dialog._addRejectElements();
		return dialog.show() as EvaluationDialog;
	}

	protected constructor(dialogId: string) {
		super(dialogId, false);
	}
	//endregion

	//region private members
	//endregion

	//region private methods
	//endregion
}