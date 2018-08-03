import GeoLocation from "tetris/profiler/profileValues/geoLocation";
import BaseService from "tetris/profiler/service/baseService";
import Measurement from "tetris/profiler/measurement/measurement";
import * as GoogleMapsAPI from 'googlemaps';

// TODO: Move to centralized config
const IP_GEO_SERVICE = 'https://ipapi.co/json/';
const GOOGLE_MAPS_API_KEY: string = '<INSERT-API-KEY>';

export default class GeoLocationService extends BaseService {

	//region public members
	public static get serviceName(): string {
		return 'GeoLocationService';
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(errorCallback: (senderName: string, error: Error) => void) {
		super(GeoLocationService.serviceName, errorCallback);
		const publicConfig = {
			key: GOOGLE_MAPS_API_KEY,
			stagger_time:       1000, // for elevationPath
			encode_polylines:   false,
			secure:             false // use https
		};
		this._googleMapsAPI = new GoogleMapsAPI(publicConfig);
	}
	//endregion

	//region private members
	private _successCallback: (senderName: string, measurement: Measurement<GeoLocation>) => void;
	private _googleMapsAPI: GoogleMapsAPI;
	//endregion

	//region private methods
	private static _browserIsCompatible(): boolean {
		return !!navigator.geolocation;
	}

	private _handleCoordinates(position: Position): void {
		const reverseGeocodeParams = {
			"latlng":		position.coords.latitude + "," + position.coords.longitude,
			"result_type":   "postal_code",
			"language":      "en",
			"location_type": "APPROXIMATE"
		};

		this._googleMapsAPI.reverseGeocode(reverseGeocodeParams, (error: Error, result: object) => {
			if(!result) {
				this._errorCallback(this.name, error);
				this._postRun();
				return;
			}
			this._receiveLocation(result);
		});
	}

	private _handleCoordinatesError(error: PositionError): void {
		this._errorCallback(this.name, new Error(error.message));
		this._postRun();
	}

	private _serveResults(result: GeoLocation): void {
		this._successCallback(this.name, new Measurement<GeoLocation>(result, this.name));
		this._postRun();
	}

	private _receiveLocation(resultSet: object): void {
		if(resultSet['results'].length < 1) {
			this._calculateLocationBasedOnIP();
			return;
		}
		let zip = 0, city = '', country = '';
		const address_components = resultSet['results'][0]['address_components'];
		address_components.forEach(component => {
			if (component['types'].includes('postal_code')) {
				zip = component['long_name']
			}
			if (component['types'].includes('country')) {
				country = component['long_name']
			}
			if (component['types'].includes('locality')) {
				city = component['long_name']
			}
		});
		this._serveResults(new GeoLocation(zip, city, country));
	}

	private _calculateLocationBasedOnIP(): void {
		fetch(IP_GEO_SERVICE)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				this._serveResults(new GeoLocation(data['postal'], data['city'], data['country_name']));
			})
			.catch((error) => {
				this._errorCallback(this.name, error);
				this._postRun();
			});
	}
	//endregion

	//region protected methods
	protected async _run(
		successCallback: (senderName: string, measurement: Measurement<GeoLocation>) => void): Promise<void> {
		this._successCallback = successCallback;
		if (!GeoLocationService._browserIsCompatible()) {
			// fallback handling: Try to get position based on IP
			this._calculateLocationBasedOnIP();
		}
		navigator.geolocation.getCurrentPosition(
			this._handleCoordinates.bind(this),
			this._handleCoordinatesError.bind(this)
		);
	}
	//endregion
}