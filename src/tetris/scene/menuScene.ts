/// <reference path="../../../definitions/phaser.d.ts"/>

import TextButton from "tetris/ui/textButton";
import config from "tetris/config";
import Game from "tetris/game";

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
		this._pipeline.setFloat1('uTime', time / 800);
	}
	//endregion

	//region constructor
	public constructor(game: Game) {
		super({
			key: "MenuScene"
		});
		this._game = game;
	}
	//endregion

	//region private members
	private _background: Phaser.GameObjects.Sprite;
	private _playButton: TextButton;
	private _optionsButton: TextButton;
	private readonly _game: Game;
	private _pipeline: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
	//endregion

	//region private methods
	private _createBackground(): void {
		const backgroundGraphics = this.add.graphics();
		this._pipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
			game: this._game,
			renderer: this._game.renderer, 
			fragShader: this.cache.shader.get('rainbow') 
		});
		(this._game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('rainbow', this._pipeline);

		this._pipeline.setFloat2('uResolution', config.graphics.width, config.graphics.height);

		backgroundGraphics.fillStyle(0xffffff);
		backgroundGraphics.fillRect(0, 0, config.graphics.width, config.graphics.height);
		backgroundGraphics.generateTexture('backgroundGraphics');
		this._background = this.add.sprite(config.graphics.width / 2, config.graphics.height / 2, 'backgroundGraphics');

		this._background.setPipeline('rainbow');
	}

	private _createButtons(): void {
		const menuStartX: number = config.graphics.width / 2;
		const menuStartY: number = config.graphics.height / 3;
		const spacing: number = 20;
		this._playButton = new TextButton(this, menuStartX, 0, "blue_button00.png", "blue_button01.png", "Start Game", () => this._game.changeScene(config.sceneKeys.playScene));
		this._optionsButton = new TextButton(this, menuStartX, 0, "blue_button00.png", "blue_button01.png", "Options", () => {});
		this._playButton.y = menuStartY;
		this._optionsButton.y = menuStartY + this._playButton.height + spacing;
	}
	//endregion
}
