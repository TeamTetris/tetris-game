/// <reference path="../../../definitions/phaser.d.ts"/>


/** import { Brick } from "./brick/brick"; */
import { BiasEvent } from "tetris/biasEngine/biasEvent"
import { BiasEventType } from "tetris/biasEngine/biasEventType";

export class BiasEngine {

	//region public members
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		if (time > this._lastBiasEvent + this._biasEventInterval) {
			this._lastBiasEvent = time;
			this._spawnBiasEvent();
		}
	}

	/**getNewBrickBias(field: Field): BrickBias {
        // TODO: generate new brick bias
    }*/
	//endregion

	//region constructor
	constructor(/** TODO: profiler: Profiler */) {
		/** this.profiler = profiler; */
	}
	//endregion

	//region private members
	private static POSSIBLE_EVENTS: BiasEventType[];
	private _lastBiasEvent: number = 0;
	private _biasEventInterval : number = 1000;
	//private _biasEventSubscribers: BiasEventSubscriber[];
	/** private profiler: Profiler;*/
	//endregion

	//region private methods
	private _spawnBiasEvent(): void {

	}
	//endregion
}
