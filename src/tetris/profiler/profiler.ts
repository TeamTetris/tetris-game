import Profile from 'tetris/profiler/profile';
import GeoLocationService from 'tetris/profiler/service/geoLocationService';
import GeoLocation from "tetris/profiler/profileValues/geoLocation";

interface ProfileChangedEventHandler {
	(profile: Profile): void;
}

export default class Profiler {

	//region public members
	public get profile(): Profile {
		return this._profile;
	}
	//endregion

	//region public methods
	public onProfileChanged(handler: ProfileChangedEventHandler) {
		this._profileChangedListener = this._profileChangedListener.concat(handler);
	}
	//endregion

	//region constructor
	public constructor() {
		this._profile = new Profile();
		this._profileChangedListener = [];
		this._gpsGeoLocationService = new GeoLocationService(this._handleNewGPSGeoLocation, this._handleGPSError);
		this._gpsGeoLocationService.requestCurrentLocation();
	}
	//endregion

	//region private members
	private readonly _profile: Profile;
	private _profileChangedListener: ProfileChangedEventHandler[];
	private readonly _gpsGeoLocationService: GeoLocationService;
	//endregion

	//region private methods
	private _profileChanged(): void {
		this._profileChangedListener.forEach(handler => {
			handler(this.profile);
		});
	}

	// SUCCESS callbacks
	private _handleNewGPSGeoLocation(location: GeoLocation): void {
		this.profile.location.value = location;

		this._profileChanged();
	}

	// ERROR callbacks
	private _handleGPSError(error: Error) {
		console.log(error);
		this._gpsGeoLocationService.requestCurrentLocation();
	}
	//endregion
}
