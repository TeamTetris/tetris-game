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
		return dialog.show() as CreateProfileDialog;
	}

	protected constructor(dialogId: string) {
		super(dialogId, false);
		this._htmlElement.querySelector('#activate-camera-button').addEventListener(
			'click',
			this._onActivateCameraButtonClicked.bind(this)
		);
		this._htmlElement.querySelectorAll('.preset-container img').forEach((image: HTMLImageElement) => {
			image.addEventListener(
				'click',
				this._onPresetClicked.bind(this)
			);
		});

		document.querySelector('#playername').addEventListener(
			'DOMSubtreeModified',
			this._setRegisterButtonState.bind(this)
		);
	}
	//endregion

	//region private members
	private _profilePicture: string;
	private _playerName: string;
	private _getRewards: boolean;
	private _presetOrImageChosen: boolean = false;
	//endregion

	//region private methods
	private _setRegisterButtonState(): void {
		const input: HTMLDivElement = document.querySelector('#playername');
		const inputValue: string = input.innerHTML;
		const registerButton: HTMLButtonElement = document.querySelector('#register-button');

		if ((inputValue === '' || !this._presetOrImageChosen) && !registerButton.disabled) {
			registerButton.disabled = true;
		} else if (inputValue !== '' && this._presetOrImageChosen && registerButton.disabled) {
			registerButton.disabled = false;
		};
	}

	private async _onActivateCameraButtonClicked(event: Event): Promise<void> {
		event.preventDefault();
		event.stopPropagation();
		this._profilePicture = await Dialog.displayCameraDialog();
		this._getRewards = this._profilePicture !== '';
		this._htmlElement.querySelector('.icon-container').classList.add('hide');
		this._htmlElement.querySelector('.icon-container-title').classList.add('hide');
		this._htmlElement.querySelector('.reward-container').classList.remove('hide');
		this._presetOrImageChosen = true;
		this._setRegisterButtonState();
	}

	private async _onPresetClicked(event: Event) {
		console.log(event);
		const preset: HTMLImageElement = event.target as HTMLImageElement;
		this._htmlElement.querySelectorAll('.preset-container img').forEach((image : HTMLImageElement) => {
			image.classList.remove('preset-border');
		});
		preset.classList.add('preset-border');
		this._presetOrImageChosen = true;
		this._setRegisterButtonState();
	}
	//endregion
}