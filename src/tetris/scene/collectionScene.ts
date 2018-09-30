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
import { skinRarityColor } from "tetris/brick/skinRarity";
import CustomBrick from "tetris/brick/customBrick";

export default class CollectionScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public create(): void {
		this._createBackground();
		this._createButtons();
	}

	public update(time: number, delta: number): void {
		this._pipeline.setFloat1('uTime', time / this._timeScale);
	}
	//endregion

	//region constructor
	public constructor(game: Game, skinStorage: SkinStorage) {
		super({ key: "CollectionScene" });
		this._game = game;
		this._skinStorage = skinStorage;
		this._selectedSkins = new Map<BrickType, Skin>();

		for (let brickType = 0; brickType < Object.keys(BrickType).length / 2; brickType++) {
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
	private readonly _timeScale: number = 2600;
	//endregion

	//region private methods
	private _createBackground(): void {
		const backgroundGraphics = this.add.graphics();
		this._pipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
			game: this._game,
			renderer: this._game.renderer, 
			fragShader: this.cache.shader.get('rainbow') 
		});
		(this._game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('rainbowCollection', this._pipeline);

		
		backgroundGraphics.fillStyle(0xffffff);
		backgroundGraphics.fillRect(0, 0, config.graphics.width, config.graphics.height);
		backgroundGraphics.generateTexture('backgroundGraphics');
		this._background = this.add.sprite(config.graphics.width / 2, config.graphics.height / 2, 'backgroundGraphics');
		this._pipeline.setFloat2('uResolution', config.graphics.width, config.graphics.height);
		this._pipeline.setFloat3('uTint', 0.6, 0.6, 0.3);
		this._pipeline.setFloat1('uZoom', 2.0);

		this._background.setPipeline('rainbowCollection');
	}

	private _createButtons(): void {
		const menuX1: number = config.graphics.width / 3;
		const menuX2: number = 2 * config.graphics.width / 3;
		const menuY: number = config.graphics.height / 5;
		const spacingX: number = 100;
		const spacingY: number = config.graphics.height / 6;

		new TextButton(this, config.graphics.width / 2, config.graphics.height * 7 / 8, "green_button00.png", "green_button01.png", "OK", function(){ this._game.changeScene(config.sceneKeys.menuScene); }.bind(this));
		
		const customBrickOffsets = [
			new Vector2(-0.5, 0), 
			new Vector2(-1, -1), 
			new Vector2(-1, -0.5), 
			new Vector2(0, -0.5), 
			new Vector2(-1.5, -1), 
			new Vector2(-1.5, -1), 
			new Vector2(-1.5, -1) 
		];

		for (let i = 0; i < Object.keys(BrickType).length / 2; i++) {
			const x = i < 4 ? menuX1 : menuX2;
			const y = menuY + (i % 4) * spacingY + (i / 4) * spacingY * 0.5;
			const brick = new CustomBrick(this, i, this._selectedSkins.get(i).frameName, x, y);
			const text = this.add.bitmapText(
				0,
				y + 70,
				config.ui.fontKeys.kenneyMiniSquare,
				this._selectedSkins.get(i).name);
			text.x = x - text.width / 2;

			const lock = this.add.sprite(x, y, config.graphics.lockTextureKey);
			lock.setVisible(false);
			new TextButton(
				this, 
				x - spacingX, 
				y, 
				"blue_sliderLeft.png", 
				"blue_sliderLeft.png", 
				"", 
				this._changeSkin.bind(this, brick, i as BrickType, lock, -1, text, x)
			);
			new TextButton(
				this, 
				x + spacingX, 
				y, 
				"blue_sliderRight.png", 
				"blue_sliderRight.png", 
				"", 
				this._changeSkin.bind(this, brick, i as BrickType, lock, 1, text, x)
			);
		}
	}

	private _changeSkin(
			brick: CustomBrick, 
			brickType: BrickType, 
			lock: Phaser.GameObjects.Sprite, 
			indexMovement: number, 
			text: Phaser.GameObjects.BitmapText, 
			textBaseX: number): void {
		const newSkinIndex = this._selectedSkins.get(brickType).id + indexMovement + this._skinStorage.skinAmount;
		const newSkin = this._skinStorage.getSkin(brickType, newSkinIndex % this._skinStorage.skinAmount);
		this._selectedSkins.set(brickType, newSkin);
		brick.setFrameName(newSkin.frameName);
		text.setText(newSkin.name);
		text.x = textBaseX - text.width / 2;
		text.tint = skinRarityColor[newSkin.rarity];
		if (newSkin.isUnlocked) {
			this._skinStorage.equipSkin(brickType, newSkin);
			lock.setVisible(false);
			brick.setTint(0xffffff);
		} else {
			lock.setVisible(true);
			brick.setTint(0x000000);
		}
	}	
 	//endregion
}
