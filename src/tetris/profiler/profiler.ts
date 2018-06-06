import Profile from 'tetris/profiler/profile';
import GeoLocationService from 'tetris/profiler/service/geoLocationService';
import ProfileData from "tetris/profiler/profileData";

export default class Profiler {

	//region public members
	//endregion

	//region public methods

	public get profile(): Profile {
		return this._profile;
	}
	//endregion

	//region constructor
	constructor() {
		this._profile = new Profile();
		this._gpsGeoLocationService = new GeoLocationService(this._handleNewGPSGeoLocation, this._handleGPSError);
		this._gpsGeoLocationService.requestCurrentLocation();
	}
	//endregion

	//region private members
	private readonly _profile: Profile;
	private readonly _gpsGeoLocationService: GeoLocationService;
	//endregion

	//region private methods
	// SUCCESS callbacks
	private _handleNewGPSGeoLocation(locationProfile: ProfileData): void {
		this.profile.location = locationProfile;
	}

	// ERROR callbacks
	private _handleGPSError(error: Error) {
		console.log(error);
		this._gpsGeoLocationService.requestCurrentLocation();
	}
	//endregion
}
