import BaseProfileData from 'tetris/profiler/baseProfileData';
import ProfileDataUpdateStrategy from "tetris/profiler/updateStrategy/profileDataUpdateStrategy";

export default class ProfileData<ValueType> extends BaseProfileData {

	//region public members
	public get value(): ValueType {
		return this._value;
	}

	public get updateStrategy(): ProfileDataUpdateStrategy<ValueType> {
		return this._updateStrategy;
	}

	public set updateStrategy(strategy: ProfileDataUpdateStrategy<ValueType>) {
		this._updateStrategy = strategy;
	}

	public get valueHistory(): Map<number, ValueType> {
		return this._valueHistory;
	}
	//endregion

	//region public methods
	public updateValue(serviceName: string, value: ValueType): void {
		this._dataSources.add(serviceName);
		this._value = this._updateStrategy.accumulate(this, value);
		this._isDefined = true;
		this._addMeasurement(value);
	}
	//endregion

	//region constructor
	public constructor() {
		super();

		this._valueHistory = new Map<number, ValueType>();
		this._updateStrategy = new ProfileDataUpdateStrategy<ValueType>();
	}
	//endregion

	//region private members
	private _value: ValueType;
	private readonly _valueHistory: Map<number, ValueType>;
	private _updateStrategy: ProfileDataUpdateStrategy<ValueType>;
	//endregion

	//region private methods
	private _addMeasurement(value: ValueType): void {
		this._latestMeasurement = Date.now();
		this._valueHistory.set(this._latestMeasurement, value);
	}
	//endregion
}
