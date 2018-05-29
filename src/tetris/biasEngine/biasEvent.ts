/// <reference path="../../../definitions/phaser.d.ts"/>

import BiasEventType from "tetris/biasEngine/biasEventType"

export class BiasEvent {

	//region public members
	public get eventType(): BiasEventType {
		return this._eventType;
	}

	public get startTime(): number {
		return this._startTime;
	}

	public get endTime(): number {
		return this._endTime;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(biasEventType: BiasEventType, startTime: number, endTime: number) {
		this._eventType = biasEventType;
		this._startTime = startTime;
		this._endTime = endTime;
	}
	//endregion

	//region private members
	private readonly _eventType: BiasEventType;
	private readonly _startTime: number;
	private readonly _endTime: number;
	//endregion

	//region private methods
	//endregion
}
