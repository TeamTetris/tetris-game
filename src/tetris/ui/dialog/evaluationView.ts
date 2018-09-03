import Profile from "tetris/profiler/profile";
import {Timeline, DataSet} from "vis";
import Game from "tetris/game";
import BiasEvaluation from "tetris/biasEngine/biasEvaluation";

const CSS_CLASS_DATA_WRAPPER = "evaluation-data-wrapper";
const BASE64_IMAGE_PREFIX = "data:image/png;base64, ";
const DIALOG_TITLE_WRAPPER_CLASS = "dialog-title";

const TIMELINE_GROUP_BIAS_EVENTS = "Bias Events";
const TIMELINE_GROUP_MEASUREMENT = "Profile Measurement";

export default class EvaluationView {

	//region public members
	//endregion

	//region publsic methods
	public show(): EvaluationView {
		this._htmlElement.classList.add('visible');
		this._update();
		return this;
	}
	//endregion

	//region constructor
	public constructor(game: Game) {
		this._htmlElement = document.getElementById("evaluation-dialog");
		this._informationContainer = this._htmlElement.querySelector("#evaluation-dialog-basic-information");
		this._pictureContainer = this._htmlElement.querySelector("#evaluation-dialog-picture");
		this._timelineContainer = this._htmlElement.querySelector("#evaluation-dialog-timeline");
		this._game = game;
		this._displayTitle("Evaluate your player profile");
	}
	//endregion

	//region private members
	private _game: Game;
	protected readonly _htmlElement: HTMLElement;
	private readonly _informationContainer: HTMLDivElement;
	private readonly _pictureContainer: HTMLImageElement;
	private readonly _timelineContainer: HTMLDivElement;
	private _timeline: Timeline;

	private get profile(): Profile {
		return this._game.profiler.profile;
	}

	private get biasEvaluation(): BiasEvaluation {
		return this._game.biasEngine.biasEvaluation;
	}
	//endregion

	//region private methods
	private _displayBasicInformation(): void {
		const nodes = [];
		nodes.push(EvaluationView._createDataWrapper('age', this.profile.age));
		nodes.push(EvaluationView._createDataWrapper('beauty', this.profile.beauty));
		nodes.push(EvaluationView._createDataWrapper('ethnicity', this.profile.ethnicity));
		nodes.push(EvaluationView._createDataWrapper('gender', this.profile.gender));
		nodes.push(EvaluationView._createDataWrapper('glasses', this.profile.glasses));
		nodes.push(EvaluationView._createDataWrapper('operating-system', this.profile.operatingSystem));
		nodes.push(EvaluationView._createDataWrapper('skin-acne', this.profile.skinAcne));
		nodes.push(EvaluationView._createDataWrapper('skin-health', this.profile.skinHealth));
		nodes.push(EvaluationView._createDataWrapper('number-of-matches', this.profile.numberOfMatches));
		nodes.push(EvaluationView._createDataWrapper('time-played', this.profile.timePlayed / 1000));

		nodes.forEach(datum => this._displayDatum(datum));
	}

	private _displayLastPlayerImage(): void {
		if (this.profile.image) {
			this._pictureContainer.classList.remove("hide");
			this._pictureContainer.classList.add("display");
			this._pictureContainer.src = BASE64_IMAGE_PREFIX + this.profile.image;
		} else {
			this._pictureContainer.classList.remove("display");
			this._pictureContainer.classList.add("hide");
		}
	}

	private _displayTimeline(): void {
		const timelineItems = new DataSet();

		this.biasEvaluation.biasEvents.forEach(biasEvent => {
			timelineItems.add({
				title: biasEvent.eventType.toString(),
				type: 'range',
				start: biasEvent.startTime,
				end: biasEvent.endTime,
				group: TIMELINE_GROUP_BIAS_EVENTS,
				subgroup: TIMELINE_GROUP_BIAS_EVENTS + " " + biasEvent.eventType.toString(),
			});
		});

		this.profile.forEachProperty(profileDate => {
			profileDate.forEachMeasurement(measurement => {
				timelineItems.add({
					title: measurement.dataSourceName,
					type: 'point',
					start: measurement.timeStamp,
					group: TIMELINE_GROUP_MEASUREMENT,
					subgroup: TIMELINE_GROUP_MEASUREMENT ,
				});
			});
		});

		this._timeline = new Timeline(this._timelineContainer, timelineItems, {});
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
		this._displayTimeline();
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