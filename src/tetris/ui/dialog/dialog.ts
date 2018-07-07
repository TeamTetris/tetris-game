import DialogResult from "tetris/ui/dialog/dialogResult";

const DIALOG_TITLE_WRAPPER_ID = "modal-title";

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
	public show(): Promise<Dialog> {
		this._htmlElement.classList.add('visible');
		return new Promise<Dialog>((resolve) => {
			this._successCallback = resolve.bind(this, this);
		});
	}

	public addAcceptButton(buttonId: string): Dialog {
		document.getElementById(buttonId).addEventListener('click', () => {
			this.result = DialogResult.Accepted;
		});
		return this;
	}

	public addRejectButton(buttonId: string): Dialog {
		document.getElementById(buttonId).addEventListener('click', () => {
			this.result = DialogResult.Rejected;
		});
		return this;
	}
	//endregion

	//region constructor
	public static display(modalId: string, title: string, closeOnSideClick: boolean = true): Dialog {
		try {
			const dialog = new Dialog(modalId, closeOnSideClick);
			dialog.title = title;
			return dialog;
		} catch {
			console.warn("Can not display modal " + modalId);
		}
	}

	private constructor(modalId: string, closeOnSideClick: boolean) {
		this._htmlElement = document.getElementById(modalId);
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
	private readonly _htmlElement: HTMLElement;
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

	private _displayTitle(title: string): void {
		const titleWrapper = this._htmlElement.querySelector('#' + DIALOG_TITLE_WRAPPER_ID);
		if (!titleWrapper) {
			return;
		}
		titleWrapper.innerHTML = title;
	}
	//endregion
}