import ProfileDataConfidenceStrategy from "tetris/profiler/confidenceStrategy/profileDataConfidenceStrategy";
import Utility from "tetris/utility";

export default class BaseProfileData {

	//region public members
	public static get MIN_CONFIDENCE(): number {
		return 0;
	}

	public static get MAX_CONFIDENCE(): number {
		return 1;
	}

	public static get CONFIDENCE_RANGE(): number {
		return this.MAX_CONFIDENCE - this.MIN_CONFIDENCE;
	}

	public get isDefined(): boolean {
		return this._isDefined;
	}

	public get latestMeasurement(): number {
		return this._latestMeasurement;
	}

	public get confidence(): number {
		return this._confidence;
	}

	public set confidence(confidence: number) {
		this._confidence = Utility.limitValueBetweenMinAndMax(confidence, BaseProfileData.MIN_CONFIDENCE, BaseProfileData.MAX_CONFIDENCE);
	}

	public get confidenceStrategy(): ProfileDataConfidenceStrategy {
		return this._confidenceStrategy;
	}

	public set confidenceStrategy(strategy: ProfileDataConfidenceStrategy) {
		this._confidenceStrategy = strategy;
	}

	public get dataSources(): Set<string> {
		return this._dataSources;
	}
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		this._confidenceStrategy.update(this, delta);
	}
	//endregion

	//region constructor
	protected constructor() {
		this._confidence = BaseProfileData.MIN_CONFIDENCE;
		this._confidenceStrategy = ProfileDataConfidenceStrategy.ultraFast();
		this._dataSources = new Set<string>();
	}
	//endregion

	//region private members
	private _confidenceStrategy: ProfileDataConfidenceStrategy;
	private _confidence: number;
	//endregion

	//region private methods
	//endregion

	//region protected members
	protected _isDefined: boolean = false;
	protected _latestMeasurement: number = 0;
	protected readonly _dataSources: Set<string>;
	//endregion

}
