/// <reference path="../../../definitions/phaser.d.ts"/>

import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventType from "tetris/biasEngine/biasEventType";
import BiasEventReceiver from "tetris/biasEngine/biasEventReceiver";
import Field from "tetris/field/field";
import BrickBias from "tetris/brick/brickBias";
import Profiler from "tetris/profiler/profiler";
import Profile from "tetris/profiler/profile";

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
		return BrickBias.newFromTierList(field, this._currentBiasValue);
	}
	//endregion

	//region constructor
	public constructor(profiler: Profiler) {
		this._profiler = profiler;
		this._profiler.registerProfileChangedEventHandler(this._onProfileUpdate);
	}
	//endregion

	//region private members
	private static POSSIBLE_EVENTS: BiasEventType[];
	private _lastBiasEvent: number = 0;
	private _biasEventInterval: number = 10000;
	private _eventReceivers: BiasEventReceiver[] = [];
	/*
		Bias Value:
		-1.0: Maximum negatively biased game experience
		 0.0: Normal game experience
		 1.0: Maximum positively biased game experience
	*/
	private _currentBiasValue: number = 1.0; 
	private _profiler: Profiler;
	//endregion

	//region private methods
	private _onProfileUpdate(profile: Profile): void {
		/**this._currentBiasValue = profile.age etc. */
	}

	private _sendBiasEvent(event: BiasEvent): void {
		this._eventReceivers.forEach((eventReceiver) => eventReceiver.receiveEvent(event));
	}

	private _spawnBiasEvent(): void {

	}
	//endregion
}
