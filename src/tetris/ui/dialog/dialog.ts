import DialogResult from "tetris/ui/dialog/dialogResult";
import CameraController from "tetris/profiler/hardwareController/cameraController";
import HardwarePermission from "tetris/profiler/hardwareController/hardwarePermission";

const DIALOG_TITLE_WRAPPER_CLASS = "dialog-title";

export default class Dialog {

	//region public members
	public get result(): DialogResult {
		return this._result;
	}

	public set result(result: DialogResult) {
		this._result = result;
		this._hide();
	}

	public set title(title: string) {
		this._title = title;
		this._displayTitle(title);
	}
	//endregion

	//region public methods
	public show(): Dialog {
		this._htmlElement.classList.add('visible');
		return this;
	}

	public awaitResult(): Promise<Dialog> {
		return new Promise<Dialog>((resolve) => {
			this._successCallback = resolve.bind(this, this);
		});
	}

	public addAcceptElement(element: HTMLElement): Dialog {
		element.addEventListener("click", () => {
			this.result = DialogResult.Accepted;
		});
		return this;
	}

	public addRejectElement(element: HTMLElement): Dialog {
		element.addEventListener("click", () => {
			this.result = DialogResult.Rejected;
		});
		return this;
	}
	//endregion

	//region constructor
	public static async displayCameraDialog(): Promise<string> {
		await CameraController.instance.requestWebcamPermissions();
		if (CameraController.instance.permissionState !== HardwarePermission.granted) {
			return '';
		}
		await CameraController.instance.startVideoStream();
		const dialog = Dialog.display('camera-dialog', 'Take a photo');
		await dialog.awaitResult();
		CameraController.instance.stopVideoStream();
		if (dialog.result === DialogResult.Accepted) {
			return CameraController.instance.lastPhoto;
		}
		return '';
	}

	public static display(dialogId: string, title: string, closeOnSideClick: boolean = true): Dialog {
		try {
			const dialog = new Dialog(dialogId, closeOnSideClick);
			dialog.title = title;
			dialog._addAcceptElements();
			dialog._addRejectElements();
			return dialog.show();
		} catch {
			console.warn("Can not display dialog " + dialogId);
		}
	}

	protected constructor(dialogId: string, closeOnSideClick: boolean) {
		this._htmlElement = document.getElementById(dialogId);
		this._closeOnSideClick = closeOnSideClick;

		if(this._closeOnSideClick) {
			window.onclick = (event) => {
				if (event.target === this._htmlElement) {
					this.result = DialogResult.Rejected;
				}
			};
		}
	}
	//endregion

	//region private members
	protected readonly _htmlElement: HTMLElement;
	private _result: DialogResult;
	private _title: string;
	private readonly _closeOnSideClick: boolean;
	private _successCallback: () => void;
	//endregion

	//region private methods
	private _hide(): void {
		this._htmlElement.classList.remove('visible');
		this._successCallback();
	}

	protected _addAcceptElements(): void {
		for (const acceptElement of this._htmlElement.getElementsByClassName("dialog-accept-element")) {
			this.addAcceptElement(acceptElement as HTMLElement);
		}
	}

	protected _addRejectElements(): void {
		for (const rejectElement of this._htmlElement.getElementsByClassName("dialog-reject-element")) {
			this.addRejectElement(rejectElement as HTMLElement);
		}
	}

	private _displayTitle(title: string): void {
		const titleWrapper = this._htmlElement.querySelector('.' + DIALOG_TITLE_WRAPPER_CLASS);
		if (!titleWrapper) {
			return;
		}
		titleWrapper.innerHTML = title;
	}
	//endregion
}