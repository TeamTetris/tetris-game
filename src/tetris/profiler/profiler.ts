import Profile from 'tetris/profiler/profile';
import GeoLocationService from 'tetris/profiler/service/geoLocationService';
import GeoLocation from "tetris/profiler/profileValues/geoLocation";
import Measurement from "tetris/profiler/measurement/measurement";
import BaseMeasurement from "tetris/profiler/measurement/baseMeasurement";

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
		this._measurementHistory = [];
		this._gpsGeoLocationService = new GeoLocationService(
			Profiler._handleServiceError
		);
		this._gpsGeoLocationService.run(this._handleNewLocation.bind(this));
	}
	//endregion

	//region private members
	private readonly _profile: Profile;
	private readonly _profileChangedListeners: ProfileChangedEventHandler[];
	private readonly _measurementHistory: BaseMeasurement[];
	private readonly _gpsGeoLocationService: GeoLocationService;
	//endregion

	//region private methods
	private _profileChanged(): void {
		this._profileChangedListeners.forEach(handler => {
			handler(this.profile);
		});
	}

	// SUCCESS callbacks
	private _handleNewLocation(sender: GeoLocationService, measurement: Measurement<GeoLocation>): void {
		this._measurementHistory.push(measurement);
		// TODO: handle new measurement
		this._profileChanged();
	}

	// ERROR callbacks
	private static _handleServiceError(senderName: string, error: Error): void {
		console.log(senderName + " ==> " + error);
	}
	//endregion
}
