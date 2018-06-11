import BaseProfileData from 'tetris/profiler/baseProfileData';
import ProfileData from 'tetris/profiler/profileData';
import GeoLocation from 'tetris/profiler/profileValues/geoLocation';

const LOCATION_KEY = "location";

export default class Profile {

	//region public members
	public get location(): ProfileData<GeoLocation> {
		if (!this._data.has(LOCATION_KEY)) {
			throw new Error("cannot read location data from profile!")
		}

		return this._data.get(LOCATION_KEY) as ProfileData<GeoLocation>;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor() {
		this._data = new Map<string, BaseProfileData>();
		this._addProfileData<GeoLocation>(LOCATION_KEY);
	}
	//endregion

	//region private members
	private readonly _data: Map<string, BaseProfileData>;
	//endregion

	//region private methods
	private _addProfileData<ValueType>(name: string): void {
		this._data.set(name, new ProfileData<ValueType>());
	}
	//endregion
}