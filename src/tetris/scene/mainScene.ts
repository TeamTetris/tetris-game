/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from "tetris/field/field";
import Player from "tetris/player/player";
import BrickFactory from "tetris/brick/brickFactory";
import BiasEngine from "tetris/biasEngine/biasEngine";
import LocalPlayer from "tetris/player/localPlayer";
import Vector2 = Phaser.Math.Vector2;

const FIELD_WIDTH: number = 10;
const FIELD_HEIGHT: number = 18;
const FIELD_DRAW_OFFSET: Vector2 = new Vector2(240, 0);
const BLOCK_SIZE: number = 32;

export default class MainScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas("puzzleSpriteAtlas", "./assets/images/sprites.png", "./assets/images/sprites.json");
	}

	public create(): void {
		this._createFieldBackground();
	}

	public update(time: number, delta: number): void {
		this._field.update(time, delta);
	}
	//endregion

	//region constructor
	public constructor(biasEngine: BiasEngine) {
		super({
			key: "MainScene"
		});
		this._field = new Field(FIELD_WIDTH, FIELD_HEIGHT, FIELD_DRAW_OFFSET, new BrickFactory(this, biasEngine));
		//this._player = new LocalPlayer(this._field, this.input.keyboard, biasEngine.newEventReceiver());
	}
	//endregion

	//region private members
	private _player: Player;
	private _field: Field;
	private _fieldBackground: Phaser.GameObjects.Graphics;
	//endregion

	//region private methods
	private _createFieldBackground(): void {
		this._fieldBackground = this.add.graphics();
		this._fieldBackground.fillStyle(0x004070);
		this._fieldBackground.fillRect(FIELD_DRAW_OFFSET.x, FIELD_DRAW_OFFSET.y, BLOCK_SIZE * FIELD_WIDTH, BLOCK_SIZE * FIELD_HEIGHT);
	}
	//endregion
}
