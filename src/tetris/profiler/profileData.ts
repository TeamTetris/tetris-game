import BaseProfileData from 'tetris/profiler/baseProfileData';

export default class ProfileData<ValueType> extends BaseProfileData {

	//region public members
	public get value(): ValueType {
		return this._value;
	}

	public set value(value: ValueType) {
		this._isDefined = true;
		this._value = value;
		this._confidence = BaseProfileData.MAX_CONFIDENCE;
		this._addMeasurement(value);
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor() {
		super();

		this._valueHistory = new Map<number, ValueType>();
	}
	//endregion

	//region private members
	private _value: ValueType;
	private _valueHistory: Map<number, ValueType>;
	//endregion

	//region private methods
	private _addMeasurement(value: ValueType): void {
		this._latestMeasurement = Date.now();
		this._valueHistory.set(this._latestMeasurement, value);
	}
	//endregion
}
