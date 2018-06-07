/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from 'tetris/field/field';
import Player from "tetris/player/player";
import BiasEventReceiver from 'tetris/biasEngine/biasEventReceiver';
import KeyboardManager = Phaser.Input.Keyboard.KeyboardManager;
import BiasEventType from 'tetris/biasEngine/biasEventType';
import BiasEventDuplicateInput from 'tetris/biasEngine/events/biasEventDuplicateInput';

export default class LocalPlayer extends Player {

	//region public members
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		// update bias events
		this._biasEventReceiver.update(time, delta);
		// apply bias
		if (this._biasEventReceiver.has(BiasEventType.DisableInput)) {
			return;
		}
		let moveOperation: () => void;


		// handle keyboard inputs
		if (Phaser.Input.Keyboard.JustDown(this._cursorKeys.left)) {
			moveOperation = this.moveLeft.bind(this);
		} else if (Phaser.Input.Keyboard.JustDown(this._cursorKeys.right)) {
			moveOperation = this.moveRight.bind(this);
		} else if (this._cursorKeys.down.isDown) {
			moveOperation = this.moveDown.bind(this);
		} else if (Phaser.Input.Keyboard.JustDown(this._cursorKeys.space)) {
			moveOperation = this.dropToFloor.bind(this);
		} else if (Phaser.Input.Keyboard.JustDown(this._cursorKeys.up)) {
			moveOperation = this.rotate.bind(this);
		}
		if (moveOperation) {
			moveOperation();
			this._applyDuplicateInputBias(moveOperation);
		}
	}
	//endregion

	//region constructor
	public constructor(field: Field, keyboard: KeyboardManager, biasEventReceiver: BiasEventReceiver) {
		super(field);
		this._keyboard = keyboard;
		this._cursorKeys = keyboard.createCursorKeys();
		this._biasEventReceiver = biasEventReceiver;
		this._biasEventReceiver.filters = [ BiasEventType.DisableInput, BiasEventType.DuplicateInput ];
	}
	//endregion

	//region private members
	private _cursorKeys: CursorKeys;
	private _keyboard: KeyboardManager;
	private _biasEventReceiver: BiasEventReceiver;
	//endregion

	//region private methods
	private _applyDuplicateInputBias(moveOperation: () => void) {
		if (!this._biasEventReceiver.has(BiasEventType.DuplicateInput)) {
			return;
		}
		const biasEvent = this._biasEventReceiver.get(BiasEventType.DuplicateInput) as BiasEventDuplicateInput;
		if (biasEvent.chance <= Math.random()) {
			moveOperation();
		}
	}
	//endregion
}
