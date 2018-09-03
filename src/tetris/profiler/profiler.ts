import Profile from "tetris/profiler/profile";
import GeoLocationService from "tetris/profiler/service/geoLocationService";
import GeoLocation from "tetris/profiler/profileValues/geoLocation";
import Measurement from "tetris/profiler/measurement/measurement";
import BaseMeasurement from "tetris/profiler/measurement/baseMeasurement";
import BaseProfileData from "tetris/profiler/baseProfileData";
import FppAnalysisService from "tetris/profiler/service/fppAnalysisService";
import BaseService from "tetris/profiler/service/baseService";
import Game from "tetris/game";
import Match from "tetris/match/match";
import FppFaceAnalysis from "tetris/profiler/profileValues/fppFaceAnalysis";
import Dialog from "tetris/ui/dialog/dialog";
import DialogResult from "tetris/ui/dialog/dialogResult";

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

	public forEachMeasurement(callback: (Measurement) => void): void {
		this._measurementHistory.forEach(callback);
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
	public constructor(game: Game) {
		this._profile = new Profile();
		this._services = new Map();
		this._game = game;
		this._serviceConsumers = new Map();
		this._profileChangedListeners = [];
		this._measurementHistory = [];

		this._game.onEndOfMatch(this._handleEndOfMatch.bind(this));
		this._game.onStartOfMatch(this._handleStartOfMatch.bind(this));

		const geoLocationService = new GeoLocationService(
			Profiler._handleServiceError
		);
		this._addService(geoLocationService,
			(profile: Profile, measurement: Measurement<GeoLocation>) =>
				profile.location.updateValue(geoLocationService.name, measurement.value)
		);

		const faceAnalysisService = new FppAnalysisService(
			Profiler._handleServiceError
		);
		this._addService(faceAnalysisService,
			(profile: Profile, measurement: Measurement<FppFaceAnalysis>) =>
				profile.fppFaceAnalysis.updateValue(faceAnalysisService.name, measurement.value)
		);
	}
	//endregion

	//region private members
	private readonly _profile: Profile;
	private readonly _game: Game;
	private readonly _services: Map<string, BaseService>;
	private readonly _serviceConsumers: Map<string, BaseServiceConsumer[]>;
	private readonly _profileChangedListeners: ProfileChangedEventHandler[];
	private readonly _measurementHistory: BaseMeasurement[];
	//endregion

	//region private methods
	private async _handleEndOfMatch(match: Match): Promise<void> {
		this._profile.addMatch(match);

		if (this._profile.numberOfMatches >= 1 && !this._services.get(GeoLocationService.serviceName).hasBeenStarted) {
			await this._startGeoLocationService();
		}

		if (this._profile.numberOfMatches >= 2 /* TODO: check if mic service has been started */) {
			// TODO: start mic service
		}
	}

	private async _startGeoLocationService(): Promise<void> {
		const locationDialog = Dialog.display(
			"geolocation-permission-dialog",
			"Join your local community",
			false
		);
		await locationDialog.awaitResult();
		if(locationDialog.result != DialogResult.Accepted) {
			return;
		}
		this._callService(GeoLocationService.serviceName);
	}

	private _handleStartOfMatch(match: Match): void {
		if (this._profile.numberOfMatches < 1) {
			this._callService(FppAnalysisService.serviceName);
		}
	}

	private _profileChanged(): void {
		this._profileChangedListeners.forEach(handler => {
			handler(this.profile);
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

	// ERROR callbacks
	private static _handleServiceError(senderName: string, error: Error): void {
		console.log(senderName + " ==> " + error);
	}
	//endregion
}
