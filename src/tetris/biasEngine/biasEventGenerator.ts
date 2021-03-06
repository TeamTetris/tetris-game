import BiasEngine from "tetris/biasEngine/biasEngine";
import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventDisableInput from "tetris/biasEngine/events/biasEventDisableInput";
import BiasEventDuplicateInput from "tetris/biasEngine/events/biasEventDuplicateInput";
import BiasEventReceiver from "tetris/biasEngine/biasEventReceiver";
import Utility from "tetris/utility";
import BiasEventFreezeLocalField from "tetris/biasEngine/events/biasEventFreezeLocalField";

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

	public static get MIN_TARGET_DETECTION_LEVEL(): number {
    	return BiasEventGenerator.MIN_DETECTION_LEVEL + 0.25 * BiasEventGenerator.DETECTION_LEVEL_RANGE;
	}

	public static get MAX_TARGET_DETECTION_LEVEL(): number {
    	return BiasEventGenerator.MAX_DETECTION_LEVEL - 0.25 * BiasEventGenerator.DETECTION_LEVEL_RANGE;
	}
	
	public get latestBiasEvent(): BiasEvent {
		return this._latestBiasEvent;
	}

	// @ts-ignore
	public get currentDetectionLevel(): number {
        return this._detectionLevel;
    }

	// @ts-ignore
    public get targetDetectionLevel(): number {
    	return this._targetDetectionLevel;
    }
    //endregion

    //region public methods
    public update(time: number, delta: number): void {
	    this._biasEventReceivers.forEach(receiver => {
	    	receiver.update(time, delta);
	    });

    	const currentBias = this._biasEngine.currentBiasValue;
    	this._decreaseDetectionLevel(delta);
    	this.targetDetectionLevel = BiasEventGenerator._calculateTargetDetectionLevel(currentBias);

    	if (!this._readyForBiasEvent()) {
    		return;
	    }

	    const eventPrototype = this._selectEventPrototype();
    	if (!eventPrototype) {
    		return;
	    }

    	const event = eventPrototype.initializeFromPrototype(this.targetDetectionLevel - this.currentDetectionLevel);
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
			new BiasEventFreezeLocalField(),
		]
	}
    //endregion

    //region private members
	private readonly _minBiasEventIntervalInMs = 20000;
	private readonly _biasEngine: BiasEngine;
	private readonly _biasEventPrototypes: BiasEvent[];
	private readonly _biasEventReceivers: BiasEventReceiver[] = [];
    private _detectionLevel: number = 0;
    private _targetDetectionLevel: number = 0;

    private _latestBiasEvent: BiasEvent;

	// @ts-ignore
    private set currentDetectionLevel(level: number) {
    	this._detectionLevel = Utility.limitValueBetweenMinAndMax(level, BiasEventGenerator.MIN_DETECTION_LEVEL, BiasEventGenerator.MAX_DETECTION_LEVEL);
    }

	// @ts-ignore
	private set targetDetectionLevel(level: number) {
    	this._targetDetectionLevel = Utility.limitValueBetweenMinAndMax(level, BiasEventGenerator.MIN_TARGET_DETECTION_LEVEL, BiasEventGenerator.MAX_TARGET_DETECTION_LEVEL);
	}
    //endregion

    //region private methods
	private _decreaseDetectionLevel(deltaInMs: number): void {
    	let decrease = BiasEventGenerator._calculateFallbackDetectionLevelDecrease(deltaInMs);
    	if (this._latestBiasEvent) {
    		decrease = this._latestBiasEvent.calculateDetectionLevelDecrease(deltaInMs);
	    }

	    this.currentDetectionLevel = this.currentDetectionLevel - decrease;
	}

	private static _calculateFallbackDetectionLevelDecrease(deltaInMs: number): number {
    	// decrease at a rate of 5% per second
    	return BiasEventGenerator.DETECTION_LEVEL_RANGE * 0.05 * (deltaInMs / 1000.0);
	}

	private static _calculateTargetDetectionLevel(currentBias: number): number {
    	const relativeBias = Math.abs(currentBias - BiasEngine.NEUTRAL_BIAS_VALUE);
    	const levelRange = BiasEventGenerator.MAX_TARGET_DETECTION_LEVEL - BiasEventGenerator.MIN_TARGET_DETECTION_LEVEL;
    	return BiasEventGenerator.MIN_TARGET_DETECTION_LEVEL + relativeBias * levelRange;
	}

	private _readyForBiasEvent(): boolean {
    	if (this.currentDetectionLevel >= this.targetDetectionLevel) {
    		return false;
	    }

	    if (this._latestBiasEvent && this._latestBiasEvent.isActive) {
	    	return false;
	    }

	    return !(this._latestBiasEvent && Date.now() < this._latestBiasEvent.endTime + this._minBiasEventIntervalInMs);
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
    	console.log("sending bias event: ");
    	console.log(event);
    	this._biasEngine.biasEvaluation.add(event);
    	this._latestBiasEvent = event;
		this._biasEventReceivers.forEach((eventReceiver) => eventReceiver.receiveEvent(event));
	}
    //endregion
}