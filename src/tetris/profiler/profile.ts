import BaseProfileData from 'tetris/profiler/baseProfileData';
import ProfileData from 'tetris/profiler/profileData';
import GeoLocation from 'tetris/profiler/profileValues/geoLocation';
import NumberDataUpdateStrategy from "tetris/profiler/updateStrategy/numberDataUpdateStrategy";

const LOCATION_KEY = "location";
const AGE_KEY = "age";

export default class Profile {

	//region public members
	public get location(): ProfileData<GeoLocation> {
		return this._getProperty(LOCATION_KEY) as ProfileData<GeoLocation>;
	}

	public get age(): ProfileData<number> {
		return this._getProperty(AGE_KEY) as ProfileData<number>;
	}
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		this._data.forEach((profileData: BaseProfileData) => {
			profileData.update(time, delta);
		});
	}
	//endregion

	//region constructor
	public constructor() {
		this._data = new Map<string, BaseProfileData>();
		this._newProfileData<GeoLocation>(LOCATION_KEY);
		this._newProfileData<number>(AGE_KEY).updateStrategy = new NumberDataUpdateStrategy();
	}
	//endregion

	//region private members
	private readonly _data: Map<string, BaseProfileData>;
	//endregion

	//region private methods
	private _getProperty(key: string): BaseProfileData {
		if (!this._data.has(key)) {
			throw new Error("cannot read " + key + " data from profile!")
		}

		return this._data.get(key);
	}

	private _newProfileData<ValueType>(name: string): ProfileData<ValueType> {
		const profileData = new ProfileData<ValueType>();
		this._data.set(name, profileData);

		return profileData;
	}
	//endregion
}