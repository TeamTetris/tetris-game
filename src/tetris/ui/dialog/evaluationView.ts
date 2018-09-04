import Profile from "tetris/profiler/profile";
import {Timeline, DataSet, TimelineItem, TimelineGroup} from "vis";
import Game from "tetris/game";
import BiasEvaluation from "tetris/biasEngine/biasEvaluation";
import Profiler from "tetris/profiler/profiler";
import BiasEventType from "tetris/biasEngine/biasEventType";
import BiasEngine from "tetris/biasEngine/biasEngine";

const CSS_CLASS_DATA_WRAPPER = "evaluation-data-wrapper";
const BASE64_IMAGE_PREFIX = "data:image/png;base64, ";
const VIEW_TITLE_WRAPPER_CLASS = "view-title";

const TIMELINE_GROUP_BIAS_EVENTS = "Bias Events";
const TIMELINE_GROUP_BIAS_VALUE = "Bias Value";

export default class EvaluationView {

	//region public members
	//endregion

	//region public methods
	public show(): EvaluationView {
		if (!this.profiler) {
			return this;
		}
		this._htmlElement.classList.add('visible');
		this._update();
		return this;
	}
	//endregion

	//region constructor
	public constructor(game: Game) {
		this._htmlElement = document.getElementById("evaluation-view");
		this._informationContainer = this._htmlElement.querySelector("#evaluation-view-basic-information");
		this._pictureContainer = this._htmlElement.querySelector("#evaluation-view-picture");
		this._timelineContainer = this._htmlElement.querySelector("#evaluation-view-timeline");
		this._game = game;
		this._displayTitle("Evaluate your player profile");
	}
	//endregion

	//region private members
	private readonly _game: Game;
	protected readonly _htmlElement: HTMLElement;
	private readonly _informationContainer: HTMLDivElement;
	private readonly _pictureContainer: HTMLImageElement;
	private readonly _timelineContainer: HTMLDivElement;
	private _timelineGroups: Map<string, TimelineGroup>;
	private _timeline: Timeline;
	private _timelineItems: DataSet<TimelineItem>;

	private get profiler(): Profiler {
		return this._game.profiler;
	}

	private get profile(): Profile {
		return this.profiler.profile;
	}

	private get biasEvaluation(): BiasEvaluation {
		return this._game.biasEngine.biasEvaluation;
	}

	private get biasEngine(): BiasEngine {
		return this._game.biasEngine;
	}
	//endregion

	//region private methods
	private _displayBasicInformation(): void {
		const nodes = [];
		nodes.push(EvaluationView._createDataWrapper('age', this.profile.age));
		nodes.push(EvaluationView._createDataWrapper('beauty', (this.profile.beauty * 100).toFixed(2) + "%"));
		nodes.push(EvaluationView._createDataWrapper('ethnicity', this.profile.ethnicity));
		nodes.push(EvaluationView._createDataWrapper('gender', this.profile.gender));
		nodes.push(EvaluationView._createDataWrapper('glasses', this.profile.glasses));
		nodes.push(EvaluationView._createDataWrapper('operating-system', this.profile.operatingSystem));
		nodes.push(EvaluationView._createDataWrapper('skin-acne', (this.profile.skinAcne * 100).toFixed(2) + "%"));
		nodes.push(EvaluationView._createDataWrapper('skin-health', (this.profile.skinHealth * 100).toFixed(2) + "%"));
		nodes.push(EvaluationView._createDataWrapper('number-of-matches', this.profile.numberOfMatches));
		nodes.push(EvaluationView._createDataWrapper('time-played', this.profile.timePlayed / 1000));

		nodes.forEach(datum => this._displayDatum(datum));
	}

	private _displayLastPlayerImage(): void {
		if (this.profile.image) {
			this._pictureContainer.classList.add("display");
			this._pictureContainer.src = BASE64_IMAGE_PREFIX + this.profile.image;
		} else {
			this._pictureContainer.classList.remove("display");
		}
	}

	private static _getDisplayBiasValue(biasValue: number): string {
		const factor = (biasValue - BiasEngine.NEUTRAL_BIAS_VALUE) / (BiasEngine.BIAS_RANGE / 2);
		return (factor * 100).toFixed(4) + "%";
	}

	private _createTimeLineGroups(): void {
		this._timelineGroups = new Map();
		this._timelineGroups.set(TIMELINE_GROUP_BIAS_VALUE, {
			id: TIMELINE_GROUP_BIAS_VALUE,
			content: TIMELINE_GROUP_BIAS_VALUE,
			className: TIMELINE_GROUP_BIAS_VALUE.replace(" ", "-")
		} as TimelineGroup);

		Object.keys(BiasEventType).forEach(key => {
			if (!isNaN(Number(key))) {
				return;
			}
			this._timelineGroups.set(key, {
				id: key,
				content: key,
				className: key
			} as TimelineGroup);
		});
	}

	private _getOrCreateTimeLineGroup(key: string): TimelineGroup {
		if (!this._timelineGroups.has(key)) {
			this._timelineGroups.set(key, {
				id: key,
				content: key,
				className: key,
			} as TimelineGroup);
		}
		return this._timelineGroups.get(key);
	}

	private _addBiasValueTimelineItems(): void {
		this.biasEngine.biasValueHistory.forEach((biasValue, timestamp) => {
			this._timelineItems.add({
				type: 'point',
				start: timestamp,
				group: TIMELINE_GROUP_BIAS_VALUE,
				content: EvaluationView._getDisplayBiasValue(biasValue),
				className: biasValue < BiasEngine.NEUTRAL_BIAS_VALUE ? "negative-bias-value" : "positive-bias-value"
			} as TimelineItem);
		});
	}

	private _addBiasEventTimelineItems(): void {
		this.biasEvaluation.biasEvents.forEach(biasEvent => {
			this._timelineItems.add({
				type: 'range',
				start: biasEvent.startTime,
				end: biasEvent.endTime,
				group: this._timelineGroups.get(BiasEventType[biasEvent.eventType]).id,
				subgroup: TIMELINE_GROUP_BIAS_EVENTS + " " + BiasEventType[biasEvent.eventType],
			} as TimelineItem);
		});
	}

	private _addMeasurementTimelineItems(): void {
		this.profiler.forEachMeasurement(measurement => {
			this._timelineItems.add({
				type: 'point',
				start: measurement.timestamp,
				group: this._getOrCreateTimeLineGroup(measurement.dataSourceName).id,
				title: measurement.value.printHTML()
			} as TimelineItem);
		});
	}

	private _displayTimeline(): void {
		this._timelineItems = new DataSet();
		this._addBiasEventTimelineItems();
		this._addBiasValueTimelineItems();
		this._addMeasurementTimelineItems();

		this._timeline = new Timeline(
			this._timelineContainer,
			this._timelineItems,
			Array.from(this._timelineGroups.values()),
			{}
		);
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
		wrapper.id = "evaluation-" + key;
		wrapper.innerHTML = "<strong>" + key.replace(/-/g, " ") + ":</strong> " + value.toString() || "undefined";
		return wrapper;
	}

	private _update(): void {
		this._displayBasicInformation();
		this._displayLastPlayerImage();
		this._createTimeLineGroups();
		this._displayTimeline();
	}

	private _displayTitle(title: string): void {
		const titleWrapper = this._htmlElement.querySelector('.' + VIEW_TITLE_WRAPPER_CLASS);
		if (!titleWrapper) {
			return;
		}
		titleWrapper.innerHTML = title;
	}
	//endregion
}