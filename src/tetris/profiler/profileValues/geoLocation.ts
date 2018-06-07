export default class GeoLocation {

	//region public members
	public get zip(): number {
		return this._zip;
	}

	public get city(): string {
		return this._city;
	}

	public get country(): string {
		return this._country;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	constructor(zip: number, city: string, country: string) {
		this._zip = zip;
		this._city = city;
		this._country = country;
	}
	//endregion

	//region private members
	public _zip: number;
	public _city: string;
	public _country: string;
	//endregion

	//region private methods
	//endregion
}