/// <reference path="../../../definitions/phaser.d.ts"/>

import TextButton from "tetris/ui/textButton";
import Vector2 = Phaser.Math.Vector2;
import config from "tetris/config";

const FIELD_DRAW_OFFSET: Vector2 = new Vector2(0, 0);

type changeSceneFunction = (scene: string) => void;

export default class MenuScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas(config.atlasKeys.uiSpriteAtlasKey, "./assets/images/uiSprites.png", "./assets/images/uiSprites.json");
		this.load.glsl('rainbow', "./assets/shaders/rainbow.glsl")
	}

	public create(): void {
		this._createBackground();
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
	private _background: Phaser.GameObjects.Graphics;
	private _playButton: TextButton;
	private _optionsButton: TextButton;
	private _changeScene: changeSceneFunction;
	//endregion

	//region private methods
	private _createBackground(): void {
		this._background = this.add.graphics();
		this._background.fillStyle(0x00ffff);
		this._background.fillRect(0, 0, config.graphics.width, config.graphics.height);
	}

	private _createButtons(): void {
		const menuStartX: number = config.graphics.width / 2;
		const menuStartY: number = config.graphics.height / 3;
		const spacing: number = 20
		this._playButton = new TextButton(this, menuStartX, 0, "blue_button00.png", "blue_button01.png", "Start Game", () => this._changeScene(config.sceneKeys.playScene));
		this._optionsButton = new TextButton(this, menuStartX, 0, "blue_button00.png", "blue_button01.png", "Options", () => {});
		this._playButton.y = menuStartY;
		this._optionsButton.y = menuStartY + this._playButton.height + spacing;
		
		new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
			fragShader: this.cache.shader.get('rainbow')
		});
		this.game.renderer.
		
		const test = this.add.sprite(0,0,"blue_button00.png");
		test.setPipeline('')
	}
	//endregion
}
