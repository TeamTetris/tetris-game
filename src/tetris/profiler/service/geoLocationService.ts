import GeoLocation from "tetris/profiler/profileValues/geoLocation";
import InverseGeoCordingService from "tetris/profiler/service/inverseGeoCordingService";

const IP_GEO_SERVICE = 'https://ipapi.co/json/';

export default class GeoLocationService {

	//region public members
	//endregion

	//region public methods
	public requestCurrentLocation(): void {
		if (!GeoLocationService._browserIsCompatible()) {
			// fallback handling: Try to get position based on IP
			this._calculateLocationBasedOnIP();
		}
		navigator.geolocation.getCurrentPosition(
			this._inverseGeoCordingService.convert.bind(
				this._inverseGeoCordingService,
				this._receiveLocation.bind(this),
				this._receiveLocationError.bind(this)
			),
			this._receiveLocationError
		);
	}

	public monitorCurrentLocation(): void {
		if (!GeoLocationService._browserIsCompatible()) {
			// fallback handling: Try to get position based on IP
			this._calculateLocationBasedOnIP();
		}
		navigator.geolocation.watchPosition(
			this._inverseGeoCordingService.convert.bind(
				this._inverseGeoCordingService,
				this._receivePeriodicLocation.bind(this),
				this._receiveLocationError.bind(this)
			),
			this._receiveLocationError
		);
	}

	public stopMonitoring(): void {
		if(this._monitoringId == null) {
			console.log(Error('No monitoring active'));
			return;
		}
		navigator.geolocation.clearWatch(this._monitoringId);
		this._monitoringId = null;
	}
	//endregion

	//region constructor
	public constructor(successCallback: (_: GeoLocation) => void,
					   errorCallback: (_: Error) => void) {
		this._successCallback = successCallback;
		this._errorCallback = errorCallback;
		this._inverseGeoCordingService = new InverseGeoCordingService();
	}
	//endregion

	//region private members
	private _monitoringId: number;
	private readonly _successCallback: (_: GeoLocation) => void;
	private readonly _errorCallback: (_: Error) => void;
	private readonly _inverseGeoCordingService: InverseGeoCordingService;
	//endregion

	//region private methods
	private static _browserIsCompatible(): boolean {
		return !!navigator.geolocation;
	}

	private _receiveLocation(resultSet: object): void {
		if(resultSet['results'].length < 1) {
			this._calculateLocationBasedOnIP();
			return;
		}
		let zip, city, country;
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
		this._successCallback(new GeoLocation(zip, city, country));
	}

	private _receivePeriodicLocation(position: Position): void {
		// Implement different behavior for periodic position request
		this._receiveLocation(position);
	}

	private _receiveLocationError(locationError: PositionError) {
		console.log(locationError);
		// fallback handling: Try to get position based on IP
		this._calculateLocationBasedOnIP();
	}

	private _calculateLocationBasedOnIP(): void {
		fetch(IP_GEO_SERVICE)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				this._receiveIPLocation(data['postal'], data['city'], data['country_name']);
			})
			.catch((error) => {
				this._handleIPLocationError(error);
			});
	}

	private _receiveIPLocation(zip: number, city: string, country: string): void {
		this._successCallback(new GeoLocation(zip, city, country));
	}

	private _handleIPLocationError(error: Error) {
		console.log(error);
		this._errorCallback(error);
	}
	//endregion
}