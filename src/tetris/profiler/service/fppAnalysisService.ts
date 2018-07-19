import BaseService from "tetris/profiler/service/baseService";
import Measurement from "tetris/profiler/measurement/measurement";
import CameraController from "tetris/profiler/hardwareController/cameraController";
import HardwarePermission from "tetris/profiler/hardwareController/hardwarePermission";
import FppFaceAnalysis from "tetris/profiler/profileValues/fppFaceAnalysis";


export default class FppAnalysisService extends BaseService {
	//region public members
	public static get serviceName(): string {
		return 'FppAnalysisService';
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(errorCallback: (senderName: string, error: Error) => void) {
		super(FppAnalysisService.serviceName, errorCallback);
	}
	//endregion

	//region private members
	private _successCallback: (senderName: string, measurement: Measurement<FppFaceAnalysis>) => void;
	//endregion

	//region private methods
	private async _requestFaceAnalysis(image: string): Promise<void> {
		const formData = new FormData();
		const url = 'https://proxyboy2.herokuapp.com/fpp/detect';

		// Prepare form data
		formData.append("return_attributes", 'eyestatus,gender,age,ethnicity,eyestatus,beauty,skinstatus');
		formData.append("image_base64", image);

		const response = await fetch(url, {
			'method': 'POST',
			'body': formData,
		});
		const jsonResponse = await response.json();
		const faceAnalysis: FppFaceAnalysis = FppFaceAnalysis.newFromResponse(jsonResponse);

		if (!faceAnalysis) {
			this._postRun();
			this._errorCallback(this.name, new Error("Cannot read FacePlusPlus response!"));
			return;
		}

		this._successCallback(
			this.name,
			new Measurement<FppFaceAnalysis>(faceAnalysis, this.name)
		);
		this._postRun();
	}
	//endregion

	//region protected methods
	protected async _run(successCallback: (senderName: string, measurement: Measurement<Object>) => void): Promise<void> {
		this._successCallback = successCallback;
		if (CameraController.instance.permissionState !== HardwarePermission.granted) {
			this._errorCallback(this.name, new Error('Can not access camera'));
			this._postRun();
			return;
		}
		const image = await CameraController.instance.takeSnapshot();
		CameraController.instance.stopVideoStream();
		await this._requestFaceAnalysis(image);
	}
	//endregion
}