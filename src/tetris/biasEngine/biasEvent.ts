/// <reference path="../../../definitions/phaser.d.ts"/>

import BiasEventType from "tetris/biasEngine/biasEventType"
import BiasEventGenerator from "tetris/biasEngine/biasEventGenerator";
import BiasEngine from "tetris/biasEngine/biasEngine";

export default abstract class BiasEvent {

	//region public members
	public get minDurationInMs(): number {
		return 3000;
	}

	public get maxDurationInMs(): number {
		return 6000;
	}

	public get durationRange(): number {
		return this.maxDurationInMs - this.minDurationInMs;
	}

	public get eventType(): BiasEventType {
		return this._eventType;
	}

	public get startTime(): number {
		return this._startTime;
	}

	public get endTime(): number {
		return this._endTime;
	}

	public get totalDetectionLevelIncrease(): number {
		return ((this.endTime - this.startTime) / 1000.0) * this._detectionLevelIncreasePerSecond;
	}

	public get isActive(): boolean {
		const now = Date.now();

		if (now < this.startTime) {
			return false;
		}
		else if (now > this.endTime) {
			return false;
		}

		return true;
	}
	//endregion

	//region public methods
	public initializeFromPrototype(detectionLevelDelta: number): BiasEvent {
		let clone = this._clone();
		const duration = this.durationRange * (detectionLevelDelta / this._detectionLevelIncreasePerSecond);

		const now = Date.now();
		clone._startTime = now;
		clone._endTime = now + Math.max(this.minDurationInMs, Math.min(this.maxDurationInMs, duration));

		return clone;
	}

	public calculateSpawnProbability(currentBias: number) {
		const relativeBias = currentBias - BiasEngine.NEUTRAL_BIAS_VALUE;
		const relativeThreshold = this._spawnBiasThreshold - BiasEngine.NEUTRAL_BIAS_VALUE;

		if (relativeBias == 0) {
			return 0.0;
		}

		if (!this._haveSameSign(relativeBias, relativeThreshold)) {
			return 0.0;
		}

		if (Math.abs(relativeBias) >= Math.abs(relativeThreshold)) {
			return 1.0;
		}

		return Math.abs(relativeThreshold) / Math.abs(relativeBias);
	}

	public calculateDetectionLevelDecrease(deltaInMs: number): number {
		return (deltaInMs / 1000.0) * this._detectionLevelDecreasePerSecond;
	}
	//endregion

	//region constructor
	protected constructor(biasEventType: BiasEventType) {
		this._eventType = biasEventType;
	}
	//endregion

	//region private members
	private readonly _eventType: BiasEventType;
	private _startTime: number;
	private _endTime: number;
	//endregion

	//region private methods
	private _haveSameSign(value1: number, value2: number): boolean {
		if (value1 >= 0 && value2 >= 0) {
			return true;
		}
		else if (value1 < 0 && value2 < 0) {
			return true;
		}

		return false;
	}
	//endregion

	//region protected members
	protected _detectionLevelIncreasePerSecond: number = BiasEventGenerator.DETECTION_LEVEL_RANGE * 0.05;
	protected _detectionLevelDecreasePerSecond: number = BiasEventGenerator.DETECTION_LEVEL_RANGE * 0.025;
	protected _spawnBiasThreshold: number = BiasEngine.NEUTRAL_BIAS_VALUE;
	//endregion

	//region protected methods
	protected _clone(): BiasEvent {
		let event = this._createNewInstance();
		event._detectionLevelIncreasePerSecond = this._detectionLevelIncreasePerSecond;
		event._detectionLevelDecreasePerSecond = this._detectionLevelDecreasePerSecond;
		event._startTime = 0;
		event._endTime = 0;

		return event;
	}

	protected abstract _createNewInstance(): BiasEvent;

	protected _setDetectionLevelIncreasePerSecond(factor: number): void {
		this._detectionLevelIncreasePerSecond = BiasEventGenerator.DETECTION_LEVEL_RANGE * factor;
	}

	protected _setDetectionLevelDecreasePerSecond(factor: number): void {
		this._detectionLevelDecreasePerSecond = BiasEventGenerator.DETECTION_LEVEL_RANGE * factor;
	}

	protected _setNegativeSpawnBiasThreshold(factor: number): void {
		const range = BiasEngine.MAX_NEGATIVE_BIAS_VALUE - BiasEngine.NEUTRAL_BIAS_VALUE;
		this._spawnBiasThreshold = BiasEngine.NEUTRAL_BIAS_VALUE + factor * range;
	}

	protected _setPositiveSpawnBiasThreshold(factor: number): void {
		const range = BiasEngine.MAX_POSITIVE_BIAS_VALUE - BiasEngine.NEUTRAL_BIAS_VALUE;
		this._spawnBiasThreshold = BiasEngine.NEUTRAL_BIAS_VALUE + factor * range;
	}
	//endregion
}
