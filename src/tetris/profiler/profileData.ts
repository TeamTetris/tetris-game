export default class ProfileData {

	//region public members
	public measurementTimestamp: number;
	//endregion

	//region public methods
	public isDefined() {
		return !!this._value;
	}

	public get value(): any {
		this.measurementTimestamp = Date.now();
		return this._value;
	}

	public set value(value: any) {
		this._value = value;
	}
	//endregion

	//region constructor
	constructor(value = null) {
		this.value = value;
	}
	//endregion

	//region private members
	private _value: any;
	//endregion

	//region private methods
	//endregion
}