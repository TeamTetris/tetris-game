/// <reference path="../../../definitions/phaser.d.ts"/>

import TextButton from "tetris/ui/textButton";
import Vector2 = Phaser.Math.Vector2;
import config from "tetris/config";

const FIELD_WIDTH: number = 10;
const FIELD_HEIGHT: number = 18;
const FIELD_DRAW_OFFSET: Vector2 = new Vector2(0, 0);
const BLOCK_SIZE: number = 32;

type changeSceneFunction = (scene: string) => void;

export default class MenuScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas(config.atlasKeys.uiSpriteAtlasKey, "./assets/images/uiSprites.png", "./assets/images/uiSprites.json");
	}

	public create(): void {
		this._createFieldBackground();
		this._createButtons();
	}

	public update(time: number, delta: number): void {
		
	}
	//endregion

	//region constructor
	public constructor(changeScene: changeSceneFunction) {
		super({
			key: "MenuScene"
		});
		this._changeScene = changeScene;
	}
	//endregion

	//region private members
	private _fieldBackground: Phaser.GameObjects.Graphics;
	private _playButton: TextButton;
	private _optionsButton: TextButton;
	private _changeScene: changeSceneFunction;
	//endregion

	//region private methods
	private _createFieldBackground(): void {
		this._fieldBackground = this.add.graphics();
		this._fieldBackground.fillStyle(0x00ffff);
		this._fieldBackground.fillRect(FIELD_DRAW_OFFSET.x, FIELD_DRAW_OFFSET.y, BLOCK_SIZE * FIELD_WIDTH, BLOCK_SIZE * FIELD_HEIGHT);
	}

	private _createButtons(): void {
		const menuStartX: number = BLOCK_SIZE * FIELD_WIDTH / 2;
		const menuStartY: number = BLOCK_SIZE * FIELD_HEIGHT / 3;
		const spacing: number = 20
		this._playButton = new TextButton(this, menuStartX, 0, "blue_button00.png", "blue_button01.png", "Start Game", () => this._changeScene(config.sceneKeys.mainScene));
		this._optionsButton = new TextButton(this, menuStartX, 0, "blue_button00.png", "blue_button01.png", "Options", () => {});
		this._playButton.y = menuStartY;
		this._optionsButton.y = menuStartY + this._playButton.height + spacing;
	}
	//endregion
}
