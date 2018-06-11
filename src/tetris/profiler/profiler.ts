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
	public onProfileChanged(handler: ProfileChangedEventHandler): void {
		this._profileChangedListeners.push(handler);
	}
	//endregion

	//region constructor
	public constructor() {
		this._profile = new Profile();
		this._profileChangedListeners = [];
		this._gpsGeoLocationService = new GeoLocationService(
			this._handleNewGPSGeoLocation.bind(this),
			this._handleGPSError.bind(this)
		);
		this._gpsGeoLocationService.requestCurrentLocation();
	}
	//endregion

	//region private members
	private readonly _profile: Profile;
	private _profileChangedListeners: ProfileChangedEventHandler[];
	private readonly _gpsGeoLocationService: GeoLocationService;
	//endregion

	//region private methods
	private _profileChanged(): void {
		this._profileChangedListeners.forEach(handler => {
			handler(this.profile);
		});
	}

	// SUCCESS callbacks
	private _handleNewGPSGeoLocation(location: GeoLocation): void {
		this.profile.location.value = location;

		this._profileChanged();
	}

	// ERROR callbacks
	private _handleGPSError(error: Error): void {
		console.log(error);
	}
	//endregion
}
