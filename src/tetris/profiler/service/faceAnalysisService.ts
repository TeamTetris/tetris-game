import BaseService from "tetris/profiler/service/baseService";
import Measurement from "tetris/profiler/measurement/measurement";
import CameraController from "tetris/profiler/hardwareController/cameraController";
import HardwarePermission from "tetris/profiler/hardwareController/hardwarePermission";


export default class FaceAnalysisService extends BaseService {
	//region public members
	public static get serviceName(): string {
		return 'FaceAnalysisService';
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(errorCallback: (senderName: string, error: Error) => void) {
		super(FaceAnalysisService.serviceName, errorCallback);
	}
	//endregion

	//region private members
	private _successCallback: (senderName: string, measurement: Measurement<Object>) => void;
	//endregion

	//region private methods
	private static get _faceplusplusApiKey(): string {
		return 'zySNNAGkKDYDJXLRUZcfjz_Ui43WoY-W';
	}

	private static get _faceplusplusApiSecret(): string {
		return 'GJc3Od5JpTdCnhtlP4ZANhT9dxBz1sWX';
	}

	private _requestFaceAnalysis(image: string): void {
		const formData = new FormData();
		const url = 'https://proxyboy2.herokuapp.com/fpp/detect';

		// Prepare form data
		formData.append("api_key", FaceAnalysisService._faceplusplusApiKey);
		formData.append("api_secret", FaceAnalysisService._faceplusplusApiSecret);
		formData.append("return_attributes", 'eyestatus,gender,age,ethnicity,eyestatus,beauty,skinstatus');
		formData.append("image_base64", image);

		fetch(url, {
			'method': 'POST',
			'body': formData,
		}).then(response => {
			response.json().then(jsonResponse => {
				this._successCallback(
					this.name,
					new Measurement<Object>(jsonResponse['faces'][0]['attributes'], this.name)
				);
				this._postRun();
			});
		});
	}
	//endregion

	//region protected methods
	protected _run(successCallback: (senderName: string, measurement: Measurement<Object>) => void): void {
		this._successCallback = successCallback;
		if (CameraController.instance.permissionState !== HardwarePermission.granted) {
			this._errorCallback(this.name, new Error('Can not access camera'));
			this._postRun();
			return;
		}

		CameraController.instance.takeSnapshot().then(image => {
			this._requestFaceAnalysis(image);
		});
	}
	//endregion
}