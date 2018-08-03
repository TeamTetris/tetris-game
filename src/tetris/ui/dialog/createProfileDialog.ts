import Dialog from "tetris/ui/dialog/dialog";

export default class CreateProfileDialog extends Dialog {

	//region public members
	public get profilePicture(): string {
		return this._profilePicture;
	}

	public get playerName(): string {
		return this._playerName;
	}

	public get getRewards(): boolean {
		return this._getRewards;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public static display(): CreateProfileDialog {
		const dialog = new CreateProfileDialog('profile-creation-dialog');
		dialog.title = "Create a player profile";
		dialog._addAcceptElements();
		dialog._addRejectElements();
		return dialog;
	}

	protected constructor(dialogId: string) {
		super(dialogId, false);
		this._htmlElement.querySelector('#activate-camera-button').addEventListener(
			'click',
			this._onActivateCameraButtonClicked
		);
	}
	//endregion

	//region private members
	private _profilePicture: string;
	private _playerName: string;
	private _getRewards: boolean;
	//endregion

	//region private methods
	private async _onActivateCameraButtonClicked(): Promise<void> {
		this._profilePicture = await Dialog.displayCameraDialog();
		this._getRewards = this._profilePicture !== '';
	}
	//endregion
}