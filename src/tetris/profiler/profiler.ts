import Profile from 'tetris/profiler/profile';
import GeoLocationService from 'tetris/profiler/service/geoLocationService';
import GeoLocation from "tetris/profiler/profileValues/geoLocation";
import BaseService from "tetris/profiler/service/baseService";
import Measurement from "tetris/profiler/measurement/measurement";
import BaseMeasurement from "tetris/profiler/measurement/baseMeasurement";
import FaceAnalysisService from 'tetris/profiler/service/faceAnalysisService';

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
	public registerProfileChangedEventHandler(handler: ProfileChangedEventHandler): void {
		this._profileChangedListeners.push(handler);
	}

	public update(time: number, delta: number) {
		if (time > this._lastFaceCheck + this._faceCheckInterval) {
			this._lastFaceCheck = time;
			this._faceAnalysisService.run(this._handleNewFace.bind(this));
		}
	}
	//endregion

	//region constructor
	public constructor() {
		this._profile = new Profile();
		this._profileChangedListeners = [];
		this._measurementHistory = [];
		this._gpsGeoLocationService = new GeoLocationService(Profiler._handleServiceError);
		this._gpsGeoLocationService.run(this._handleNewLocation.bind(this));
		this._faceAnalysisService = new FaceAnalysisService(Profiler._handleServiceError);
	}
	//endregion

	//region private members
	private readonly _profile: Profile;
	private readonly _profileChangedListeners: ProfileChangedEventHandler[];
	private readonly _measurementHistory: BaseMeasurement[];
	private readonly _gpsGeoLocationService: GeoLocationService;

	private readonly _faceAnalysisService: FaceAnalysisService;
	private _lastFaceCheck: number = 0;
	private _faceCheckInterval: number = 1000;
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

	private _handleNewFace(sender: FaceAnalysisService, measurement: Measurement<Object>): void {
		// TODO: handle new measurement
		this._profileChanged();
	}

	// ERROR callbacks
	private static _handleServiceError(senderName: string, error: Error): void {
		console.log(senderName + " ==> " + error);
	}
	//endregion
}
