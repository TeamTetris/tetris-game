/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from "tetris/field/field";
import Player from "tetris/player/player";
import BrickFactory from "tetris/brick/brickFactory";
import BiasEngine from "tetris/biasEngine/biasEngine";
import LocalPlayer from "tetris/player/localPlayer";
import TextButton from "tetris/ui/textButton";
import config from "tetris/config";
import Vector2 = Phaser.Math.Vector2;
import { Input } from "phaser";

const FIELD_WIDTH: number = 10;
const FIELD_HEIGHT: number = 18;
const FIELD_DRAW_OFFSET: Vector2 = new Vector2(0, 0);
const BLOCK_SIZE: number = 32;

type changeSceneFunction = (scene: string) => void;

export default class MainScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas(config.atlasKeys.blockSpriteAtlasKey, "./assets/images/blockSprites.png", "./assets/images/blockSprites.json");
		this.load.atlas(config.atlasKeys.uiSpriteAtlasKey, "./assets/images/uiSprites.png", "./assets/images/uiSprites.json");
	}

	public create(): void {
		this._createFieldBackground();

		this._field = this._newField(FIELD_WIDTH, FIELD_HEIGHT, FIELD_DRAW_OFFSET);
		this._player = new LocalPlayer(this._field, this.input.keyboard, this._biasEngine.newEventReceiver());

		this._pauseKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.C);
		this._createUi();
	}

	public update(time: number, delta: number): void {
		if (Input.Keyboard.JustDown(this._pauseKey)) {
			this._paused = !this._paused;
		}
		if (this._paused) {
			return;
		}
		this._field.update(time, delta);
		this._player.update(time, delta);
	}
	//endregion

	//region constructor
	public constructor(biasEngine: BiasEngine, changeScene: changeSceneFunction) {
		super({
			key: "MainScene"
		});
		this._biasEngine = biasEngine;
		this._brickFactory = new BrickFactory(this, biasEngine);
		this._changeScene = changeScene;
	}
	//endregion

	//region private members
	private readonly _biasEngine: BiasEngine;
	private readonly _brickFactory: BrickFactory;
	private _player: Player;
	private _field: Field;
	private _fieldBackground: Phaser.GameObjects.Graphics;
	private _paused: boolean = false;
	private _pauseKey: Phaser.Input.Keyboard.Key;
	private _pauseButton: TextButton;
	private _changeScene: changeSceneFunction;
	//endregion

	//region private methods
	private _createFieldBackground(): void {
		this._fieldBackground = this.add.graphics();
		this._fieldBackground.fillStyle(0x002d4f);
		this._fieldBackground.fillRect(FIELD_DRAW_OFFSET.x, FIELD_DRAW_OFFSET.y, BLOCK_SIZE * FIELD_WIDTH, BLOCK_SIZE * FIELD_HEIGHT);
	}

	private _newField(fieldWidth: number, fieldHeight: number, drawOffset: Vector2): Field {
		const scoreText = this.add.text(drawOffset.x, drawOffset.y, "0", config.defaultFontStyle);
		return new Field(fieldWidth, fieldHeight, drawOffset, scoreText, this._brickFactory);
	}

	private _createUi() {
		const spacing: number = 5;
		this._pauseButton = new TextButton(this, 0, 0, "blue_button07.png", "blue_button08.png", "ii", () =>this._changeScene(config.sceneKeys.menuScene));
		this._pauseButton.x = BLOCK_SIZE * FIELD_WIDTH - this._pauseButton.width / 2 - spacing;
		this._pauseButton.y = this._pauseButton.height / 2 + spacing;
	}
	//endregion
}
