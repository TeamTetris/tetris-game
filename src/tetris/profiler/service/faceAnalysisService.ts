import BaseService from "tetris/profiler/service/baseService";
import Measurement from "tetris/profiler/measurement/measurement";


export default class FaceAnalysisService extends BaseService<Object> {
	//region public members
	//endregion

	//region public methods
	public run(successCallback: (sender: BaseService<Object>, measurement: Measurement<Object>) => void) {
		successCallback(this, new Measurement((<any>window).TETRIS_currentFaceValue, this.name));		
	}
	//endregion

	//region constructor
	public constructor(errorCallback: (senderName: string, error: Error) => void) {
		super('FaceAnalysisService', errorCallback);
	}
	//endregion

	//region private members
	private _successCallback: (sender: BaseService<Object>, measurement: Measurement<Object>) => void;
	//endregion

	//region private methods
	//endregion
}