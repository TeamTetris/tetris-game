export default class Measurement<MeasurementType> {

	//region public members
	public get timestamp(): number {
		return this._timestamp;
	}

	public get value(): MeasurementType {
		return this._value;
	}

	public get dataSourceName(): string {
		return this._dataSourceName;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(value: MeasurementType, dataSourceName: string) {
		this._value = value;
		this._timestamp = Date.now();
		this._dataSourceName = dataSourceName;
	}
	//endregion

	//region private members
	private readonly _timestamp: number;
	private readonly _value: MeasurementType;
	private readonly _dataSourceName: string;
	//endregion

	//region private methods
	//endregion
}