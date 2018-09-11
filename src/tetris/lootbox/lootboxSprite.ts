
/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import Font from "tetris/interfaces/Font";
import { LootboxType } from "tetris/lootbox/lootboxType";

export default class LootboxSprite {
	//region public members
	public get height(): number {
		return this._sprite.height;
	}

	public get width(): number {
		return this._sprite.width;
	}

	public get x(): number {
		return this._sprite.x;
	}

	public get y(): number {
		return this._sprite.y;
	}

	public set x(x: number) {
		this._sprite.x = x;
	}

	public set y(y: number) {
		this._sprite.y = y;
	}

	public set active(active: boolean) {
		this._active = active;
	}
	//endregion

  //region public methods
  public playOpenAnimation(): void {
    for (let i = 1; i < this._chestFrameCount; i++) {
      setTimeout(
				this._sprite.setFrame.bind(this._sprite, this._chestFrameKeyPrefix + (i + 1)),
				i * this._chestAnimationSpeed);
    }
	}
	
  public playCloseAnimation(): void {
    for (let i = this._chestFrameCount - 1; i > 0; i--) {
			setTimeout(
				this._sprite.setFrame.bind(this._sprite, this._chestFrameKeyPrefix + i), 
				(this._chestFrameCount - i) * this._chestAnimationSpeed
			);
    }
  }

  public resetAnimation(): void {
    this._sprite.setFrame(this._chestFrameKeyPrefix + "1");
	}
	
	public setSpriteDepth(depth: number): void {
		this._sprite.setDepth(depth);
	}

	public setLootboxType(lootboxType: LootboxType) {
		if (this.lootboxType !== null && lootboxType === this.lootboxType) {
			return;
		}
		this.lootboxType = lootboxType;
		this._sprite.setTexture(LootboxSprite.lootboxTypeTextureMap.get(lootboxType));
	}

	public setSpriteAlpha(alpha: number): void {
		this._sprite.setAlpha(alpha);
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number, lootboxType: LootboxType, onClick: () => any) {
		this._sprite = scene.add.sprite(x, y, config.atlasKeys.goldChestAtlasKey, this._chestFrameKeyPrefix + "1");
		this._onClick = onClick;
		this.setLootboxType(lootboxType);
		this._sprite.setInteractive();
		this._registerButtonEvents();
		this.x = x;
		this.y = y;
	}
	//endregion

	//region private members
	private _sprite: Phaser.GameObjects.Sprite;
  private readonly _onClick: () => any;
  private readonly _chestFrameKeyPrefix = "chest_00";
  private readonly _chestFrameCount = 6;
	private readonly _chestAnimationSpeed = 23;
	private _active: boolean = true;
	private lootboxType: LootboxType;
	private static readonly lootboxTypeTextureMap: Map<LootboxType, string> = new Map([
			[LootboxType.Bronze, config.atlasKeys.bronzeChestAtlasKey],
			[LootboxType.Silver, config.atlasKeys.silverChestAtlasKey],
			[LootboxType.Gold, config.atlasKeys.goldChestAtlasKey],
			[LootboxType.Diamond, config.atlasKeys.diamondChestAtlasKey],
			[LootboxType.Cyber, config.atlasKeys.cyberChestAtlasKey],
		]);
	//endregion

	//region private methods  
	private _registerButtonEvents(): void {
		this._sprite.on('pointerover', () => {
			if (!this._active) {
				return;
			}
			this._sprite.tint = 0xe0e0e0;
		});
		
		this._sprite.on('pointerout', () => {
			if (!this._active) {
				return;
			}
			this._sprite.tint = 0xffffff;
    });
    
		this._sprite.on('pointerup', () => {
			if (!this._active) {
				return;
			}
			this._onClick();
		});
	}
	//endregion
}