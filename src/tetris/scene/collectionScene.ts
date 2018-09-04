/// <reference path="../../../definitions/phaser.d.ts"/>

import Vector2 = Phaser.Math.Vector2;

import TextButton from "tetris/ui/textButton";
import config from "tetris/config";
import Game from "tetris/game";
import Brick from "tetris/brick/brick";
import BrickType from "tetris/brick/brickType";
import BrickFactory from "tetris/brick/brickFactory";
import SkinStorage from "tetris/brick/skinStorage";
import Skin from "tetris/brick/skin";

export default class CollectionScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas(config.atlasKeys.blockSpriteAtlasKey, "./assets/images/blockSprites.png", "./assets/images/blockSprites.json");
		this.load.glsl('rainbow', "./assets/shaders/rainbow.glsl");
	}

	public create(): void {
		this._createBackground();
		this._createButtons();
	}

	public update(time: number, delta: number): void {
		this._pipeline.setFloat1('uTime', time / 2600);
	}
	//endregion

	//region constructor
	public constructor(game: Game, skinStorage: SkinStorage) {
		super({
			key: "CollectionScene"
		});
		this._game = game;
		this._skinStorage = skinStorage;
		this._selectedSkins = new Map<BrickType, Skin>();

		for (let brickType = 0; brickType < 7; brickType++) {
			this._selectedSkins.set(brickType, skinStorage.getEquippedSkin(brickType));
		}
	}
	//endregion

	//region private members
	private _background: Phaser.GameObjects.Sprite;
	private _skinStorage: SkinStorage;
	private readonly _game: Game;
	private _selectedSkins: Map<BrickType, Skin>;
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
		this._pipeline.setFloat3('uTint', 0.6, 0.6, 0.3);

		this._background.setPipeline('rainbow');
	}

	private _createButtons(): void {
		const menuX1: number = config.graphics.width / 3;
		const menuX2: number = 2 * config.graphics.width / 3;
		const menuY: number = config.graphics.height / 5;
		const spacingX: number = 100;
		const spacingY: number = config.graphics.height / 6;

		new TextButton(this, config.graphics.width / 2, config.graphics.height * 6 / 7, "green_button00.png", "green_button01.png", "OK", function(){ this._game.changeScene(config.sceneKeys.menuScene); }.bind(this));
		
		const customBrickOffsets = [new Vector2(-0.5, 0), new Vector2(-1, -1), new Vector2(-1, -0.5), new Vector2(0, -0.5), new Vector2(-1.5, -1), new Vector2(-1.5, -1), new Vector2(-1.5, -1) ];

		for (let i = 0; i < 7; i++) {
			const x = i < 4 ? menuX1 : menuX2;
			const y = menuY + (i % 4) * spacingY + (i / 4) * spacingY * 0.5;
			const brick = new BrickFactory(this, null).newCustomBrick(i as BrickType, customBrickOffsets[i]);
			new TextButton(this, x - spacingX, y, "blue_sliderLeft.png", "blue_sliderLeft.png", "", this._changeSkin.bind(this, brick, i, -1));
			brick.preDraw(new Vector2(x, y));
			new TextButton(this, x + spacingX, y, "blue_sliderRight.png", "blue_sliderRight.png", "", this._changeSkin.bind(this, brick, i, 1));
		}
	}

	private _changeSkin(brick: Brick, brickType: BrickType, indexMovement: number) {
		this._selectedSkins.set(brickType, this._skinStorage.getSkin(brickType, (this._selectedSkins.get(brickType).id + indexMovement + this._skinStorage.skinAmount) % this._skinStorage.skinAmount));
		brick.blocks.forEach(b => b.spriteFrameName = this._selectedSkins.get(brickType).frameName);
		this._skinStorage.equipSkin(brickType, this._selectedSkins.get(brickType));
	}
 	//endregion
}
