import BaseMeasurement from "tetris/profiler/measurement/baseMeasurement";

export default class Measurement<MeasurementType> extends BaseMeasurement {

	//region public members
	public get value(): MeasurementType {
		return this._value;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(value: MeasurementType, dataSourceName: string) {
		super(dataSourceName);
		this._value = value;
	}
	//endregion

	//region private members
	private readonly _value: MeasurementType;
	//endregion

	//region private methods
	//endregion
}