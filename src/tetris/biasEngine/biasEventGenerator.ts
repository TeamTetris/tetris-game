import BiasEngine from "tetris/biasEngine/biasEngine";
import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventDisableInput from "tetris/biasEngine/events/biasEventDisableInput";
import BiasEventDuplicateInput from "tetris/biasEngine/events/biasEventDuplicateInput";
import BiasEventReceiver from "tetris/biasEngine/biasEventReceiver";

export default class BiasEventGenerator {
    //region public members
    public static get MAX_DETECTION_LEVEL(): number {
        return 1.0;
    }

    public static get MIN_DETECTION_LEVEL(): number {
        return 0.0;
    }

    public static get DETECTION_LEVEL_RANGE(): number {
        return BiasEventGenerator.MAX_DETECTION_LEVEL - BiasEventGenerator.MIN_DETECTION_LEVEL;
    }
    //endregion

    //region public methods
    public update(time: number, delta: number): void {
    	const currentBias = this._biasEngine.currentBiasValue;
    	this._decreaseDetectionLevel(delta);
    	const targetDetectionLevel = this._calculateTargetDetectionLevel(currentBias);

    	if (!this._readyForBiasEvent(targetDetectionLevel)) {
    		return;
	    }

	    const eventPrototype = this._selectEventPrototype();
    	const event = eventPrototype.initializeFromPrototype(targetDetectionLevel - this.currentDetectionLevel);
    	this.currentDetectionLevel += event.totalDetectionLevelIncrease;
    	this._sendBiasEvent(event);
    }

	public newEventReceiver(): BiasEventReceiver {
		const receiver = new BiasEventReceiver();
		this._biasEventReceivers.push(receiver);

		return receiver;
	}
    //endregion

    //region constructor
	public constructor(biasEngine: BiasEngine) {
    	this._biasEngine = biasEngine;
    	this._biasEventPrototypes = [
    		new BiasEventDisableInput(),
		    new BiasEventDuplicateInput(),
		]
	}
    //endregion

    //region private members
	private readonly _minBiasEventIntervalInMs = 10000;
	private readonly _biasEngine: BiasEngine;
	private readonly _biasEventPrototypes: BiasEvent[];
	private readonly _biasEventReceivers: BiasEventReceiver[] = [];
    private _detectionLevel: number;

    private _latestBiasEvent: BiasEvent;

    private get currentDetectionLevel(): number {
        return this._detectionLevel;
    }

    private set currentDetectionLevel(level: number) {
        this._detectionLevel = Math.max(BiasEventGenerator.MIN_DETECTION_LEVEL, Math.min(BiasEventGenerator.MAX_DETECTION_LEVEL, level));
    }
    //endregion

    //region private methods
	private _decreaseDetectionLevel(deltaInSeconds: number): void {
    	let decrease = this._calculateFallbackDetectionLevelDecrease(deltaInSeconds);
    	if (this._latestBiasEvent) {
    		decrease = this._latestBiasEvent.calculateDetectionLevelDecrease(deltaInSeconds);
	    }

	    this.currentDetectionLevel = this.currentDetectionLevel - decrease;
	}

	private _calculateFallbackDetectionLevelDecrease(deltaInSeconds: number): number {
    	return BiasEventGenerator.DETECTION_LEVEL_RANGE * 0.05 * deltaInSeconds;
	}

	private _calculateTargetDetectionLevel(currentBias: number): number {
    	const relativeBias = currentBias - BiasEngine.NEUTRAL_BIAS_VALUE;
    	let targetDetectionLevel = 0.25 /* offset */ + Math.min(0.8, relativeBias) * 0.75;
    	return Math.max(BiasEventGenerator.MIN_DETECTION_LEVEL, Math.min(BiasEventGenerator.MAX_DETECTION_LEVEL, targetDetectionLevel));
	}

	private _readyForBiasEvent(targetDetectionLevel: number): boolean {
    	if (this.currentDetectionLevel > targetDetectionLevel) {
    		return false;
	    }

	    if (this._latestBiasEvent && this._latestBiasEvent.isActive) {
	    	return false;
	    }

	    if (Date.now() < this._latestBiasEvent.endTime + this._minBiasEventIntervalInMs) {
	    	return false;
	    }

	    return true;
	}

	private _selectEventPrototype(): BiasEvent {
    	const currentBias = this._biasEngine.currentBiasValue;
		const spawnProbabilities = [];
		let totalSpawnProbability = 0.0;

		this._biasEventPrototypes.forEach(prototype => {
			const probability = prototype.calculateSpawnProbability(currentBias);

			if (probability <= 0.0) {
				return;
			}
			spawnProbabilities.push([probability, prototype]);
			totalSpawnProbability += probability;
		});

		let random = Math.random();
		for (let i = 0; i < spawnProbabilities.length; ++i) {
			const normalizedProbability = spawnProbabilities[i][0] / totalSpawnProbability;

			if (normalizedProbability < random) {
				random -= normalizedProbability;
				continue;
			}

			return spawnProbabilities[i][1];
		}
	}

	private _sendBiasEvent(event: BiasEvent): void {
    	console.log("sending bias event: " + event);
		this._biasEventReceivers.forEach((eventReceiver) => eventReceiver.receiveEvent(event));
	}
    //endregion
}