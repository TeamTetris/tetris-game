/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from 'tetris/field/field';
import Player from "tetris/player/player";
import BiasEventReceiver from 'tetris/biasEngine/biasEventReceiver';
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;
import BiasEventType from 'tetris/biasEngine/biasEventType';
import BiasEventDuplicateInput from 'tetris/biasEngine/events/biasEventDuplicateInput';

export default class LocalPlayer extends Player {

	//region public members
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
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
	public constructor(field: Field, keyboardPlugin: KeyboardPlugin, biasEventReceiver: BiasEventReceiver) {
		super(field);
		this._keyboardPlugin = keyboardPlugin;
		this._cursorKeys = keyboardPlugin.createCursorKeys();
		this._biasEventReceiver = biasEventReceiver;
		this._biasEventReceiver.filters = [ BiasEventType.DisableInput, BiasEventType.DuplicateInput ];
	}
	//endregion

	//region private members
	private _cursorKeys: Phaser.Input.Keyboard.CursorKeys;
	private _keyboardPlugin: KeyboardPlugin;
	private _biasEventReceiver: BiasEventReceiver;
	//endregion

	//region private methods
	private _applyDuplicateInputBias(moveOperation: () => void) {
		if (!this._biasEventReceiver.has(BiasEventType.DuplicateInput)) {
			return;
		}
		const biasEvent = this._biasEventReceiver.get(BiasEventType.DuplicateInput) as BiasEventDuplicateInput;
		if (biasEvent.chance >= Math.random()) {
			moveOperation();
		}
	}
	//endregion
}
