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

export default class LootboxScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public create(): void {
		this._createBackground();
		this._createButtons();
	}

	public update(time: number, delta: number): void {

	}
	//endregion

	//region constructor
	public constructor(game: Game, skinStorage: SkinStorage) {
		super({ key: "LootboxScene" });
		this._game = game;
		this._skinStorage = skinStorage;
	}
	//endregion

	//region private members
	private readonly _game: Game;
	private _skinStorage: SkinStorage;
	private _lootboxSprite: Phaser.GameObjects.Sprite;
	private _exitButton: TextButton;
	//endregion

	//region private methods
	private _createBackground(): void {
		const backgroundGraphics = this.add.graphics();
		backgroundGraphics.fillStyle(0x2f2f2f);
		backgroundGraphics.fillRect(0, 0, config.graphics.width, config.graphics.height);
	}

	private _openChest(): void {
		const unlockedSkins: Skin[] = [];
		const skinsPerLootbox = 4;
		const allSkins = this._skinStorage.getAllSkins();

		const chances = [0.67, 0.23, 0.08, 0.02];

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
			
			const skin = skinPool[Math.round(Math.random() * skinPool.length)];
			unlockedSkins.push(skin);
		}
		console.log('Unlocked following skins', unlockedSkins.map(s => s.name));
		unlockedSkins.forEach(s => s.unlock());
	}

	private _createButtons(): void {
		const x: number = config.graphics.width / 2;
		const y: number = config.graphics.height / 2;

		const chest = new LootboxSprite(this, config.graphics.width / 2, config.graphics.height / 2, function(){ chest.playOpenAnimation(); this._openChest(); }.bind(this));
		this._exitButton = new TextButton(this, config.graphics.width / 2, config.graphics.height * 7 / 8, "green_button00.png", "green_button01.png", "Done", function(){ this._game.changeScene(config.sceneKeys.menuScene); }.bind(this));
	}
 	//endregion
}
