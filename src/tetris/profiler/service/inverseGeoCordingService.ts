import * as GoogleMapsAPI from 'googlemaps';

export default class InverseGeoCordingService {

	//region public members
	//endregion

	//region public methods
	public convert(successCallback: (object) => void, errorCallback: (Error) => void, location: Position): void {
		const reverseGeocodeParams = {
			"latlng":        location.coords.latitude + "," + location.coords.longitude,
			"result_type":   "postal_code",
			"language":      "en",
			"location_type": "APPROXIMATE"
		};

		this._googleMapsAPI.reverseGeocode(reverseGeocodeParams, function(err, result){
			console.log(result);
			if(result) {
				successCallback(result);
			}
			else {
				errorCallback(err);
			}
		});
	}
	//endregion

	//region constructor
	constructor() {
		const publicConfig = {
			key: '<INSERT API KEY>',
			stagger_time:       1000, // for elevationPath
			encode_polylines:   false,
			secure:             false // use https
		};
		this._googleMapsAPI = new GoogleMapsAPI(publicConfig);
	}
	//endregion

	//region constructor
	//endregion

	//region private members
	private _googleMapsAPI: GoogleMapsAPI;
	//endregion

	//region private methods
	//endregion
}