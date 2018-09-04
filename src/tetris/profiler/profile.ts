import BaseProfileData from 'tetris/profiler/baseProfileData';
import ProfileData from 'tetris/profiler/profileData';
import GeoLocation from 'tetris/profiler/profileValues/geoLocation';
import Match from "tetris/match/match";
import FppFaceAnalysis from "tetris/profiler/profileValues/fppFaceAnalysis";
import Ethnicity from "tetris/profiler/profileValues/ethnicity";
import Gender from "tetris/profiler/profileValues/gender";
import OperatingSystem from "tetris/profiler/profileValues/OperatingSystem";

const LOCATION_KEY = "location";
const FPP_FACE_ANALYSIS_KEY = "fppFaceAnalysis";

export default class Profile {

	//region public members
	public get location(): ProfileData<GeoLocation> {
		return this._getProperty(LOCATION_KEY) as ProfileData<GeoLocation>;
	}

	public get fppFaceAnalysis(): ProfileData<FppFaceAnalysis> {
		return this._getProperty(FPP_FACE_ANALYSIS_KEY) as ProfileData<FppFaceAnalysis>;
	}

	public get image(): string {
		if(!this.fppFaceAnalysis.value) {
			return;
		}
		return this.fppFaceAnalysis.value.image;
	}

	public get age(): number {
		// TODO: add "mixing" logic in case of multiple data sources for this property
		if(!this.fppFaceAnalysis.value) {
			return
		}
		return this.fppFaceAnalysis.value.age;
	}

	public get beauty(): number {
		// TODO: add "mixing" logic in case of multiple data sources for this property
		if(!this.fppFaceAnalysis.value) {
			return
		}
		return this.fppFaceAnalysis.value.beauty;
	}

	public get ethnicity(): Ethnicity {
		// TODO: add "mixing" logic in case of multiple data sources for this property
		if(!this.fppFaceAnalysis.value) {
			return
		}
		return this.fppFaceAnalysis.value.ethnicity;
	}

	public get gender(): Gender {
		// TODO: add "mixing" logic in case of multiple data sources for this property
		if(!this.fppFaceAnalysis.value) {
			return
		}
		return this.fppFaceAnalysis.value.gender;
	}

	public get glasses(): boolean {
		// TODO: add "mixing" logic in case of multiple data sources for this property
		if(!this.fppFaceAnalysis.value) {
			return
		}
		return this.fppFaceAnalysis.value.glasses;
	}

	public get operatingSystem(): OperatingSystem {
		const key = Object.keys(OperatingSystem).find(key => key.toUpperCase() === window.navigator.platform.toUpperCase());
		return key ? OperatingSystem[key] : OperatingSystem.Undetected;
	}

	public get skinAcne(): number {
		// TODO: add "mixing" logic in case of multiple data sources for this property
		if(!this.fppFaceAnalysis.value) {
			return
		}
		return this.fppFaceAnalysis.value.skinAcne;
	}

	public get skinHealth(): number {
		// TODO: add "mixing" logic in case of multiple data sources for this property
		if(!this.fppFaceAnalysis.value) {
			return
		}
		return this.fppFaceAnalysis.value.skinHealth;
	}

	public get numberOfMatches(): number {
		return this._playedMatches.length;
	}

	public get timePlayed(): number {
		return this._playedMatches.reduce((sum, match) => sum + match.duration, 0);
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

	public addMatch(match: Match): void {
		this._playedMatches.push(match);
	}
	//endregion

	//region constructor
	public constructor() {
		this._data = new Map<string, BaseProfileData>();
		this._newProfileData<GeoLocation>(LOCATION_KEY);
		this._newProfileData<FppFaceAnalysis>(FPP_FACE_ANALYSIS_KEY);

		this._playedMatches = [];
	}
	//endregion

	//region private members
	private readonly _data: Map<string, BaseProfileData>;
	private readonly _playedMatches: Match[];
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