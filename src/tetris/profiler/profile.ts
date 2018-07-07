import BaseProfileData from 'tetris/profiler/baseProfileData';
import ProfileData from 'tetris/profiler/profileData';
import GeoLocation from 'tetris/profiler/profileValues/geoLocation';
import NumberDataUpdateStrategy from "tetris/profiler/updateStrategy/numberDataUpdateStrategy";

const LOCATION_KEY = "location";
const AGE_KEY = "age";
const ETHNICITY_KEY = "ethnicity";
const GENDER_KEY = "gender";
const BEAUTY_KEY = "beauty";
const SKIN_ACNE_KEY = "skin_acne";
const SKIN_HEALTH_KEY = "skin_health";
const GLASSES_KEY = "glasses";

export default class Profile {

	//region public members
	public get location(): ProfileData<GeoLocation> {
		return this._getProperty(LOCATION_KEY) as ProfileData<GeoLocation>;
	}

	public get age(): ProfileData<number> {
		return this._getProperty(AGE_KEY) as ProfileData<number>;
	}
	
	public get ethnicity(): ProfileData<string> {
		return this._getProperty(ETHNICITY_KEY) as ProfileData<string>;
	}

	public get gender(): ProfileData<string> {
		return this._getProperty(GENDER_KEY) as ProfileData<string>;
	}

	public get beauty(): ProfileData<number> {
		return this._getProperty(BEAUTY_KEY) as ProfileData<number>;
	}

	public get skinAcne(): ProfileData<number> {
		return this._getProperty(SKIN_ACNE_KEY) as ProfileData<number>;
	}

	public get skinHealth(): ProfileData<number> {
		return this._getProperty(SKIN_HEALTH_KEY) as ProfileData<number>;
	}

	public get glasses(): ProfileData<boolean> {
		return this._getProperty(GLASSES_KEY) as ProfileData<boolean>;
	}
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		this._data.forEach((profileData: BaseProfileData) => {
			profileData.update(time, delta);
		});
	}

	public forEachProperty(callback: (BaseProfileData) => void): void {
		this._data.forEach(callback);
	}
	//endregion

	//region constructor
	public constructor() {
		this._data = new Map<string, BaseProfileData>();
		this._newProfileData<GeoLocation>(LOCATION_KEY);
		this._newProfileData<number>(AGE_KEY).updateStrategy = new NumberDataUpdateStrategy();
		this._newProfileData<string>(ETHNICITY_KEY);
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