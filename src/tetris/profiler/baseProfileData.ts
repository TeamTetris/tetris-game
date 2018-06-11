export default class BaseProfileData {

	//region public members
	public static get MIN_CONFIDENCE(): number {
		return 0;
	}

	public static get MAX_CONFIDENCE(): number {
		return 1;
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
	//endregion

	//region public methods
	//endregion

	//region constructor
	protected constructor() {
		this._confidence = BaseProfileData.MIN_CONFIDENCE;
	}
	//endregion

	//region private members
	//endregion

	//region private methods
	//endregion

	//region protected members
	protected _isDefined: boolean = false;
	protected _latestMeasurement: number = 0;
	protected _confidence: number;
	//endregion

}
