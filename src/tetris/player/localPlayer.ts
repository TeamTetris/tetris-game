/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from 'tetris/field/field';
import Player from "tetris/player/player";
import BiasEventReceiver from 'tetris/biasEngine/biasEventReceiver';
import KeyboardManager = Phaser.Input.Keyboard.KeyboardManager;
import BiasEvenType from 'tetris/biasEngine/biasEventType';
import BiasEventDuplicateInput from 'tetris/biasEngine/events/biasEventDuplicateInput';

export default class LocalPlayer extends Player {

	//region public members
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		// update bias events
		this._biasEventReceiver.update(time, delta);
		// apply bias
		if (this._biasEventReceiver.has(BiasEvenType.DisableInput)) {
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
		} else if (this._cursor.up.isDown) {
			moveOperation = this.rotate;
		}

		moveOperation();

		// check whether to apply operation a second time (as bias)
		if (this._biasEventReceiver.has(BiasEvenType.DuplicateInput)) {
			const biasEvent = this._biasEventReceiver.get(BiasEvenType.DuplicateInput) as BiasEventDuplicateInput;
			if(biasEvent.chance <= Math.random()) {
				moveOperation();
			}
		}
	}
	//endregion

	//region constructor
	public constructor(field: Field, keyboard: KeyboardManager, biasEventReceiver: BiasEventReceiver) {
		super(field);
		this._keyboard = keyboard;
		this._cursor = keyboard.createCursorKeys();
		this._biasEventReceiver = biasEventReceiver;
		this._biasEventReceiver.filters = [ BiasEvenType.DisableInput, BiasEvenType.DuplicateInput ];
	}
	//endregion

	//region private members
	private _cursor: CursorKeys;
	private _keyboard: KeyboardManager;
	private _biasEventReceiver: BiasEventReceiver;
	//endregion

	//region private methods
	//endregion
}
