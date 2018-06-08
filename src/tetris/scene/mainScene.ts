/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from "tetris/field/field";
import Player from "tetris/player/player";
import BrickFactory from "tetris/brick/brickFactory";
import BiasEngine from "tetris/biasEngine/biasEngine";
import LocalPlayer from "tetris/player/localPlayer";
import Vector2 = Phaser.Math.Vector2;

const FIELD_WIDTH: number = 10;
const FIELD_HEIGHT: number = 18;
const FIELD_DRAW_OFFSET: Vector2 = new Vector2(0, 0);
const BLOCK_SIZE: number = 32;
const FONT_STYLE: object = {font: "20px Kenney Mini Square", fill: "#fff"};

export default class MainScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas("puzzleSpriteAtlas", "./assets/images/sprites.png", "./assets/images/sprites.json");
	}

	public create(): void {
		this._createFieldBackground();

		this._field = this._newField(FIELD_WIDTH, FIELD_HEIGHT, FIELD_DRAW_OFFSET);
		this._player = new LocalPlayer(this._field, this.input.keyboard, this._biasEngine.newEventReceiver());
	}

	public update(time: number, delta: number): void {
		this._field.update(time, delta);
		this._player.update(time, delta);
	}
	//endregion

	//region constructor
	public constructor(biasEngine: BiasEngine) {
		super({
			key: "MainScene"
		});
		this._biasEngine = biasEngine;
		this._brickFactory = new BrickFactory(this, biasEngine);
	}
	//endregion

	//region private members
	private readonly _biasEngine: BiasEngine;
	private readonly _brickFactory: BrickFactory;
	private _player: Player;
	private _field: Field;
	private _fieldBackground: Phaser.GameObjects.Graphics;
	//endregion

	//region private methods
	private _createFieldBackground(): void {
		this._fieldBackground = this.add.graphics();
		this._fieldBackground.fillStyle(0x002d4f);
		this._fieldBackground.fillRect(FIELD_DRAW_OFFSET.x, FIELD_DRAW_OFFSET.y, BLOCK_SIZE * FIELD_WIDTH, BLOCK_SIZE * FIELD_HEIGHT);
	}

	private _newField(fieldWidth: number, fieldHeight: number, drawOffset: Vector2): Field {
		const scoreText = this.add.text(drawOffset.x, drawOffset.y, "0", FONT_STYLE);
		return new Field(fieldWidth, fieldHeight, drawOffset, scoreText, this._brickFactory);
	}
	//endregion
}
