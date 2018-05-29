/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from "tetris/field/field";
import Player from "tetris/player/player";
import BrickFactory from "tetris/brick/brickFactory";
import BiasEngine from "tetris/BiasEngine/BiasEngine";

const GAME_WIDTH: number = 18;
const GAME_HEIGHT: number = 10;

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
	public constructor() {
		super({
			key: "MainScene"
		});
		this._biasEngine = new BiasEngine();
		this._player = new Player();
		this._field = new Field(GAME_WIDTH, GAME_HEIGHT, new BrickFactory(this._biasEngine));
	}
	//endregion

	//region private members
	private _phaserSprite: Phaser.GameObjects.Sprite;
	private _player: Player;
	private _field: Field;
	private _biasEngine: BiasEngine;
	//endregion

	//region private methods
	//endregion
}
