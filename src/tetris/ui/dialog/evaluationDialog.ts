import Dialog from "tetris/ui/dialog/dialog";
import Profile from "tetris/profiler/profile";

const CSS_CLASS_DATA_WRAPPER = "evaluation-data-wrapper";
const BASE64_IMAGE_PREFIX = "data:image/png;base64, ";

export default class EvaluationDialog extends Dialog {

	//region public members
	public set profile(profile: Profile) {
		this._profile = profile;
		this._update();
	}
	//endregion

	//region publsic methods
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
		this._informationContainer = this._htmlElement.querySelector("#evaluation-dialog-basic-information");
		this._pictureContainer = this._htmlElement.querySelector("#evaluation-dialog-picture");
	}
	//endregion

	//region private members
	private _profile: Profile;
	private readonly _informationContainer: HTMLDivElement;
	private readonly _pictureContainer: HTMLImageElement;
	//endregion

	//region private methods
	private _displayBasicInformation(): void {
		const nodes = [];
		nodes.push(EvaluationDialog._createDataWrapper('age', this._profile.age));
		nodes.push(EvaluationDialog._createDataWrapper('beauty', this._profile.beauty));
		nodes.push(EvaluationDialog._createDataWrapper('ethnicity', this._profile.ethnicity));
		nodes.push(EvaluationDialog._createDataWrapper('gender', this._profile.gender));
		nodes.push(EvaluationDialog._createDataWrapper('glasses', this._profile.glasses));
		nodes.push(EvaluationDialog._createDataWrapper('operating-system', this._profile.operatingSystem));
		nodes.push(EvaluationDialog._createDataWrapper('skin-acne', this._profile.skinAcne));
		nodes.push(EvaluationDialog._createDataWrapper('skin-health', this._profile.skinHealth));
		nodes.push(EvaluationDialog._createDataWrapper('number-of-matches', this._profile.numberOfMatches));
		nodes.push(EvaluationDialog._createDataWrapper('time-played', this._profile.timePlayed / 1000));

		nodes.forEach(datum => this._displayDatum(datum));
	}

	private _displayLastPlayerImage(): void {
		if (this._profile.image) {
			this._pictureContainer.classList.remove("hide");
			this._pictureContainer.classList.add("display");
			this._pictureContainer.src = BASE64_IMAGE_PREFIX + this._profile.image;
		} else {
			this._pictureContainer.classList.remove("display");
			this._pictureContainer.classList.add("hide");
		}
	}

	private _displayDatum(datum: Node): void {
		if (!datum) {
			return;
		}
		this._informationContainer.appendChild(datum);
	}

	private static _createDataWrapper(key: string, value: string | number | boolean): HTMLDivElement {
		if(!key || !value) {
			return;
		}
		const wrapper = document.createElement('div');
		wrapper.classList.add(CSS_CLASS_DATA_WRAPPER);
		wrapper.classList.add(key);
		wrapper.setAttribute("id", "evaluation-" + key);
		wrapper.innerHTML = "<strong>" + key.replace(/-/g, " ") + ":</strong> " + value.toString() || "undefined";
		return wrapper;
	}

	private _update(): void {
		this._displayBasicInformation();
		this._displayLastPlayerImage();
	}
	//endregion
}