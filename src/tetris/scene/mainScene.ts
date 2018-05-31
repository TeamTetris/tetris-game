/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from "tetris/field/field";
import Player from "tetris/player/player";
import BrickFactory from "tetris/brick/brickFactory";
import BiasEngine from "tetris/biasEngine/biasEngine";
import LocalPlayer from "../player/localPlayer";

const FIELD_WIDTH: number = 18;
const FIELD_HEIGHT: number = 10;

export default class MainScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.image("logo", "./assets/images/phaser.png");
	}

	public create(): void {
		this._phaserSprite = this.add.sprite(400, 300, "logo");
	}

	public update(time: number, interval: number): void {

	}
	//endregion

	//region constructor
	public constructor(biasEngine: BiasEngine) {
		super({
			key: "MainScene"
		});
		this._field = new Field(FIELD_WIDTH, FIELD_HEIGHT, new BrickFactory(biasEngine));
		this._player = new LocalPlayer(this._field, this.input.keyboard, biasEngine.newEventReceiver());
	}
	//endregion

	//region private members
	private _phaserSprite: Phaser.GameObjects.Sprite;
	private _player: Player;
	private _field: Field;
	//endregion

	//region private methods
	//endregion
}
