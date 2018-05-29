/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from '../field/field';
import Player from "./player";
import BiasEventReceiver from '../biasEngine/biasEventReceiver';
import KeyboardManager = Phaser.Input.Keyboard.KeyboardManager;

export default abstract class LocalPlayer extends Player {

	//region public members
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		// update bias events
		this._biasEventReciver.update(time, delta);
		// apply bias
		if (this._biasEventReciver.hasEvent(/** TODO: Set specific BiasEvent type **/)) {
			return;
		}
		let moveOperation: () => void;

		// handle keyboard inputs
		if(this._cursor.left.isDown) {
			moveOperation = this.moveLeft;
		} else if (this._cursor.right.isDown) {
			moveOperation = this.moveRight;
		} else if (this._cursor.down.isDown) {
			moveOperation = this.moveDown;
		} else if (this._cursor.space.isDown) {
			moveOperation = this.drop;
		}

		moveOperation();
		if (this._biasEventReciver.hasEvent(/** TODO: Set specific BiasEvent type **/)) {
			const biasEvent = this._biasEventReciver.getEvent(/** TODO: Set specific BiasEvent type **/);
			/** TODO: Implement multiple execution *//
		}
	}
	//endregion

	//region constructor
	protected constructor(field: Field, keyboard: KeyboardManager, biasEventReceiver: BiasEventReceiver) {
		super(field);
		this._keyboard = keyboard;
		this._cursor = keyboard.createCursorKeys();
		this._biases = [];
		this._biasEventReciver = biasEventReceiver;
		this._biasEventReciver.filter(/** TODO: define events localPlayer is interested in **/)
	}
	//endregion

	//region private members
	private _cursor: CursorKeys;
	private _keyboard: KeyboardManager;
	private _biasEventReciver: BiasEventReceiver;
	//endregion

	//region private methods
	//endregion
}
