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
import { skinRarityColor, SkinRarity } from "tetris/brick/skinRarity";
import LootboxSprite from "tetris/lootbox/lootboxSprite";
import CustomBrick from "tetris/brick/customBrick";
import { LootboxType } from "tetris/lootbox/lootboxType";
import LootboxStorage from "tetris/lootbox/lootboxStorage";
import { ScaleModes } from "phaser";

export default class LootboxScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public create(): void {
		this._createBackground();
		this._createOverlay();
		this._createButtons();
	}

	public update(time: number, delta: number): void {

	}
	//endregion

	//region constructor
	public constructor(game: Game, skinStorage: SkinStorage, lootboxStorage: LootboxStorage) {
		super({ key: "LootboxScene" });
		this._game = game;
		this._skinStorage = skinStorage;
		this._lootboxStorage = lootboxStorage;
	}
	//endregion

	//region private members
	private readonly _game: Game;
	private _skinStorage: SkinStorage;
	private _lootboxStorage: LootboxStorage;
	private _lootboxSprite: LootboxSprite;
	private _exitButton: TextButton;
	private _overlay: Phaser.GameObjects.Sprite;
	private _lootboxTypeText: Phaser.GameObjects.BitmapText;
	private _lootboxAmountText: Phaser.GameObjects.BitmapText;
	private _buttonChangeLootboxTypeLeft: TextButton;
	private _buttonChangeLootboxTypeRight: TextButton;
	private _displayedBricks: CustomBrick[] = [];
	private _chestTypeLootFactor: Map<LootboxType, number> = new Map([
		[LootboxType.Bronze, 0.1],
		[LootboxType.Silver, 0.5],
		[LootboxType.Gold, 1],
		[LootboxType.Diamond, 3],
		[LootboxType.Cyber, 30],
	]);
	private _displayedTexts: Phaser.GameObjects.BitmapText[] = [];
	private readonly _depthBackground: number = 0.1;
	private readonly _depthBackgroundElements: number = 0.2;
	private readonly _depthOverlay: number = 0.3;
	private readonly _depthOverlayElements: number = 0.4;
	private readonly _keyBaseX: string = 'baseX';
	private readonly _initalLootboxType: LootboxType = LootboxType.Bronze;
	private _selectedLootboxType: LootboxType = this._initalLootboxType;
	//endregion

	//region private methods
	private _createBackground(): void {
		const backgroundGraphics = this.add.graphics();
		backgroundGraphics.fillStyle(0x2f2f2f);
		backgroundGraphics.fillRect(0, 0, config.graphics.width, config.graphics.height);
		backgroundGraphics.setDepth(this._depthBackground);
	}

	private _createOverlay(): void {
		const rectangle = this.add.graphics();
		rectangle.fillStyle(0x00000, 0.8);
		rectangle.fillRect(0, 0, config.graphics.width, config.graphics.height);
		rectangle.generateTexture('overlay');
		this._overlay = this.add.sprite(config.graphics.width / 2, config.graphics.height / 2, 'overlay');
		this._overlay.setVisible(false);
		this._overlay.setDepth(this._depthOverlay);
		this._overlay.setInteractive();
		this._overlay.on('pointerup', this._closeOverlay.bind(this));
	}

	private _unlockSkins(): Skin[] {
		const unlockedSkins: Skin[] = [];
		const skinsPerLootbox = 4;
		const allSkins = this._skinStorage.getAllSkins();

		const c = this._chestTypeLootFactor.get(this._selectedLootboxType);
		const chances = [0.65*c, 0.3*c, 0.04*c, 0.01*c];
		const commonSkins = allSkins.filter(s => s.rarity == SkinRarity.Common);
		const rareSkins = allSkins.filter(s => s.rarity == SkinRarity.Rare);
		const epicSkins = allSkins.filter(s => s.rarity == SkinRarity.Epic);
		const legendarySkins = allSkins.filter(s => s.rarity == SkinRarity.Legendary);

		for (let i = 0; i < skinsPerLootbox; i++) {
			const roll = Math.random();
			let skinPool: Skin[];
			if (roll < chances[3]) {
				skinPool = legendarySkins;
			} else if (roll < chances[2]) {
				skinPool = epicSkins;
			} else if (roll < chances[1]) {
				skinPool = rareSkins
			} else {
				skinPool = commonSkins;
			}
			
			const skin = skinPool[Math.floor(Math.random() * skinPool.length)];
			unlockedSkins.push(skin);
		}
		unlockedSkins.forEach(s => s.unlock());
		return unlockedSkins;
	}

	private _openChest(): void {
		this._lootboxStorage.modifyAmount(this._selectedLootboxType, -1);
		const unlockedSkins = this._unlockSkins();
		this._lootboxSprite.playOpenAnimation();
		this._lootboxSprite.active = false;
		this._exitButton.active = false;		
		this._buttonChangeLootboxTypeLeft.active = false;
		this._buttonChangeLootboxTypeRight.active = false;
		setTimeout(this._openOverlay.bind(this, unlockedSkins), 400);
	}

	private _openOverlay(unlockedSkins: Skin[]): void {
		this._overlay.setVisible(true);
		const spacingX = config.graphics.width / 6;
		const spacingY = 70;
		for (let i = 0; i < unlockedSkins.length; i++) {
			const x = config.graphics.width / 2 + ((i - unlockedSkins.length / 2 + 0.5) * spacingX);
			const y = config.graphics.height / 2;
			const newBrick = new CustomBrick(
				this, 
				unlockedSkins[i].brickType, 
				unlockedSkins[i].frameName, 
				x, 
				y
			);
			const text = this.add.bitmapText(0, y + spacingY, config.ui.fontKeys.kenneyMiniSquare, unlockedSkins[i].name);
			text.setDepth(this._depthOverlayElements);
			text.x = x - text.width / 2;
			text.tint = skinRarityColor[unlockedSkins[i].rarity];
			newBrick.setSpriteDepth(this._depthOverlayElements);
			this._displayedTexts.push(text);
			this._displayedBricks.push(newBrick);
		}
		this._updateSpritesAndText();
	}

	private _closeOverlay(): void {
		this._lootboxSprite.resetAnimation();

		this._lootboxSprite.active = true;
		this._exitButton.active = true;
		this._buttonChangeLootboxTypeLeft.active = true;
		this._buttonChangeLootboxTypeRight.active = true;
		this._overlay.setVisible(false);
		for (let b of this._displayedBricks) {
			b.destroy();
		}
		for (let t of this._displayedTexts) {
			t.destroy();
		}
		this._displayedTexts = [];
		this._displayedBricks = [];
		this._updateSpritesAndText();
	}

	private _updateAmountText(): void {
		this._lootboxAmountText.setText(this._lootboxStorage.getAmount(this._selectedLootboxType) + 'x');
		this._lootboxAmountText.x = this._lootboxAmountText.getData(this._keyBaseX) - this._lootboxAmountText.width / 2;
	}

	private _updateTypeText(): void {
		this._lootboxTypeText.setText(LootboxType[this._selectedLootboxType] + ' Chest');
		this._lootboxTypeText.x = this._lootboxTypeText.getData(this._keyBaseX)  - this._lootboxTypeText.width / 2;
	}

	private _changeLootboxType(indexMovement: number): void {
		const chestAmount = Object.keys(LootboxType).length / 2;
		this._selectedLootboxType = (this._selectedLootboxType + indexMovement + chestAmount) % chestAmount;
		this._lootboxSprite.setLootboxType(this._selectedLootboxType);
		this._updateTypeText();
		this._updateAmountText();
		const lootboxAmount = this._lootboxStorage.getAmount(this._selectedLootboxType);
		if (lootboxAmount > 0) {
			this._lootboxSprite.setSpriteAlpha(1.0);
			this._lootboxSprite.active = true;
		} else {
			this._lootboxSprite.setSpriteAlpha(0.1);
			this._lootboxSprite.active = false;
		}
	}

	private _updateSpritesAndText(): void {
		this._changeLootboxType(0);
	}

	private _createButtons(): void {
		const x = config.graphics.width / 2;
		const y = config.graphics.height / 2;
		const spacingX = 220;
		const spacingY1 = 130;
		const spacingY2 = 200;

		this._lootboxSprite = new LootboxSprite(this, x, y - 30, this._initalLootboxType, this._openChest.bind(this));
		this._lootboxSprite.setSpriteDepth(this._depthBackgroundElements);
		this._exitButton = new TextButton(this, x, config.graphics.height * 7 / 8, "green_button00.png", "green_button01.png", "Done", this._game.changeScene.bind(this._game, config.sceneKeys.menuScene));
		this._exitButton.setDepth(this._depthBackgroundElements);
		
		this._lootboxTypeText = this.add.bitmapText(0, y + spacingY2, config.ui.fontKeys.kenneyMiniSquare, '');
		this._lootboxTypeText.setDepth(this._depthBackgroundElements);
		this._lootboxTypeText.setData(this._keyBaseX, x);

		this._lootboxAmountText = this.add.bitmapText(0, y + spacingY1, config.ui.fontKeys.kenneyMiniSquare, '');
		this._lootboxAmountText.setDepth(this._depthBackgroundElements);
		this._lootboxAmountText.setScale(2);
		this._lootboxAmountText.setScaleMode(ScaleModes.NEAREST);
		this._lootboxAmountText.setData(this._keyBaseX, x);

		this._buttonChangeLootboxTypeLeft = new TextButton(
			this, 
			x - spacingX,
			y, 
			"blue_sliderLeft.png", 
			"blue_sliderLeft.png", 
			"", 
			this._changeLootboxType.bind(this, -1)
		);
		this._buttonChangeLootboxTypeLeft.setDepth(this._depthBackgroundElements);
		this._buttonChangeLootboxTypeRight = new TextButton(
			this, 
			x + spacingX, 
			y, 
			"blue_sliderRight.png", 
			"blue_sliderRight.png", 
			"", 
			this._changeLootboxType.bind(this, 1)
		);
		this._buttonChangeLootboxTypeRight.setDepth(this._depthBackgroundElements);

		this._updateSpritesAndText();
	}
 	//endregion
}
