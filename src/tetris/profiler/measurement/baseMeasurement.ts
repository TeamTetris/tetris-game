export default abstract class BaseMeasurement {

	//region public members
	public get timestamp(): number {
		return this._timestamp;
	}

	public get dataSourceName(): string {
		return this._dataSourceName;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	protected constructor(dataSourceName: string) {
		this._timestamp = Date.now();
		this._dataSourceName = dataSourceName;
	}
	//endregion

	//region private members
	private readonly _timestamp: number;
	private readonly _dataSourceName: string;
	//endregion

	//region private methods
	//endregion
}
