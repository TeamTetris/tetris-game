import Profile from "tetris/profiler/profile";
import GeoLocationService from "tetris/profiler/service/geoLocationService";
import GeoLocation from "tetris/profiler/profileValues/geoLocation";
import Measurement from "tetris/profiler/measurement/measurement";
import BaseMeasurement from "tetris/profiler/measurement/baseMeasurement";
import BaseProfileData from "tetris/profiler/baseProfileData";
import FaceAnalysisService from "tetris/profiler/service/faceAnalysisService";
import BaseService from "tetris/profiler/service/baseService";
import DialogResult from "tetris/ui/dialog/dialogResult";
import Dialog from "tetris/ui/dialog/dialog";
import CameraController from "tetris/profiler/hardwareController/cameraController";

const CONFIDENCE_THRESHOLD = 0.25;

interface ProfileChangedEventHandler {
	(profile: Profile): void;
}

interface BaseServiceConsumer {
	(profile: Profile, measurement: BaseMeasurement): void
}

interface ServiceConsumer<MeasurementType> extends BaseServiceConsumer {
	(profile: Profile, measurement: Measurement<MeasurementType>): void
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

	public update(time: number, delta: number): void {
		this._profile.update(time, delta);
		this._profile.forEachProperty((property: BaseProfileData) => {
			if (property.confidence > CONFIDENCE_THRESHOLD * BaseProfileData.CONFIDENCE_RANGE) {
				return;
			}
			this._callServices(Array.from(property.dataSources.values()));
		});
	}
	//endregion

	//region constructor
	public constructor() {
		this._profile = new Profile();
		this._services = new Map();
		this._serviceConsumers = new Map();
		this._profileChangedListeners = [];
		this._measurementHistory = [];

		const geoLocationService = new GeoLocationService(
			Profiler._handleServiceError
		);
		this._addService(geoLocationService,
			(profile: Profile, measurement: Measurement<GeoLocation>) =>
				profile.location.updateValue(geoLocationService.name, measurement.value)
		);

		const faceAnalysisService = new FaceAnalysisService(
			Profiler._handleServiceError
		);
		this._addService(faceAnalysisService,
			(profile: Profile, measurement: Measurement<Object>) =>
				this._handleNewFace(faceAnalysisService, measurement)
		);
		geoLocationService.run(this._consumeService.bind(this));
		this._requestWebcam();
	}
	//endregion

	//region private members
	private readonly _profile: Profile;
	private readonly _services: Map<string, BaseService>;
	private readonly _serviceConsumers: Map<string, BaseServiceConsumer[]>;
	private readonly _profileChangedListeners: ProfileChangedEventHandler[];
	private readonly _measurementHistory: BaseMeasurement[];
	//endregion

	//region private methods
	private _profileChanged(): void {
		this._profileChangedListeners.forEach(handler => {
			handler(this.profile);
		});
	}

	private _requestWebcam(): void {
		CameraController.instance.startVideoStream();
		Dialog.display('camera-modal', 'Take a photo')
			.addAcceptButton('camera-modal-accept-button')
			.show()
			.then(dialog => {
				if (dialog.result !== DialogResult.Accepted) {
					return;
				}
				this._callService(FaceAnalysisService.serviceName);
			});
	}

	private _callServices(serviceNames: string[]): void {
		serviceNames.forEach((serviceName: string) => {
			this._callService(serviceName);
		});
	}

	private _callService(serviceName: string): void {
		this._services.get(serviceName).run(this._consumeService.bind(this));
	}

	private _addService<MeasurementType>(service: BaseService,
										 ...consumers: ServiceConsumer<MeasurementType>[]): void {
		this._services.set(service.name, service);
		this._serviceConsumers.set(service.name, consumers);
	}

	private _consumeService<MeasurementType>(serviceName: string,
													measurement: Measurement<MeasurementType>): void {
		this._measurementHistory.push(measurement);
		if (!this._serviceConsumers.has(serviceName)) {
			throw new Error('Cannot consume service: ' + serviceName);
		}
		this._serviceConsumers.get(serviceName).forEach(
			(consumer: ServiceConsumer<MeasurementType>) => consumer(this.profile, measurement)
		);
		this._profileChanged();
	}

	private _handleNewFace(sender: FaceAnalysisService, measurement: Measurement<Object>): void {
		this._profile.gender.updateValue(sender.name, measurement.value['gender'].value.toLowerCase());
		this._profile.beauty.updateValue(sender.name, measurement.value["beauty"][this._profile.gender + "_score"]);
		this._profile.ethnicity.updateValue(sender.name, measurement.value["ethnicity"].value);
		this._profile.age.updateValue(sender.name, measurement.value["age"].value);
		this._profile.skinAcne.updateValue(sender.name, measurement.value['skinstatus']['acne']);
		this._profile.skinHealth.updateValue(sender.name, measurement.value['skinstatus']['health']);
		this._profile.glasses.updateValue(sender.name, measurement.value['glasses'].value == 'None');
	}

	// ERROR callbacks
	private static _handleServiceError(senderName: string, error: Error): void {
		console.log(senderName + " ==> " + error);
	}
	//endregion
}
