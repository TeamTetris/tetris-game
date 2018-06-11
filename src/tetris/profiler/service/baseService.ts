import Measurement from "tetris/profiler/measurement/measurement";

export default abstract class BaseService<MeasurementType> {

	//region public members
	public get name(): string {
		return this._name;
	}
	//endregion

	//region public methods
	public abstract run(successCallback: (
		sender: BaseService<MeasurementType>,
		measurement: Measurement<MeasurementType>) => void): void;
	//endregion

	//region constructor
	protected constructor(name: string, errorCallback: (sender: BaseService<MeasurementType>, error: Error) => void) {
		this._name = name;
		this._errorCallback = errorCallback;
	}
	//endregion

	//region private members
	private readonly _name: string;
	protected readonly _errorCallback: (sender: BaseService<MeasurementType>, error: Error) => void;
	//endregion

	//region private methods
	//endregion
}