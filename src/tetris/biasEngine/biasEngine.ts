/// <reference path="../../../definitions/phaser.d.ts"/>

import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventType from "tetris/biasEngine/biasEventType";
import BiasEventReceiver from "tetris/biasEngine/biasEventReceiver";
import Field from "tetris/field/field";
import BrickBias from "tetris/brick/brickBias";

export default class BiasEngine {

	//region public members
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		if (time > this._lastBiasEvent + this._biasEventInterval) {
			this._lastBiasEvent = time;
			this._spawnBiasEvent();
		}
	}

	public newEventReceiver(): BiasEventReceiver {
		const receiver = new BiasEventReceiver();
		this._eventReceivers = this._eventReceivers.concat(receiver);

		return receiver;
	}

	public newBrickBias(field: Field): BrickBias {
		// TODO: implement biasing logic
		return BrickBias.newDefault(field);
	}
	//endregion

	//region constructor
	public constructor(/** TODO: profiler: Profiler */) {
		/** this.profiler = profiler; */
	}
	//endregion

	//region private members
	private static POSSIBLE_EVENTS: BiasEventType[];
	private _lastBiasEvent: number = 0;
	private _biasEventInterval : number = 10000;
	private _eventReceivers: BiasEventReceiver[] = [];
	/** private profiler: Profiler;*/
	//endregion

	//region private methods
	private _sendBiasEvent(event: BiasEvent): void {
		this._eventReceivers.forEach((eventReceiver) => eventReceiver.receiveEvent(event));
	}

	private _spawnBiasEvent(): void {

	}
	//endregion
}
