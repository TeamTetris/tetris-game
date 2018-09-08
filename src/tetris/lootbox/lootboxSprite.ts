
/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import Font from "tetris/interfaces/Font";

export default class LootboxSprite {
	//region public members
	public get height(): number {
		return this.sprite.height;
	}

	public get width(): number {
		return this.sprite.width;
	}

	public get x(): number {
		return this.sprite.x;
	}

	public get y(): number {
		return this.sprite.y;
	}

	public set x(x: number) {
		this.sprite.x = x;
	}

	public set y(y: number) {
		this.sprite.y = y;
	}

	public set active(active: boolean) {
		this._active = active;
	}
	//endregion

  //region public methods
  public playOpenAnimation(): void {
    for (let i = 1; i < this.chestFrameCount; i++) {
      setTimeout(this.sprite.setFrame.bind(this.sprite, this.chestFrameKeyPrefix + (i + 1)), i * this.chestAnimationSpeed);
    }
	}
	
  public playCloseAnimation(): void {
    for (let i = this.chestFrameCount - 1; i > 0; i--) {
      setTimeout(this.sprite.setFrame.bind(this.sprite, this.chestFrameKeyPrefix + i), (this.chestFrameCount - i) * this.chestAnimationSpeed);
    }
  }

  public resetAnimation(): void {
    this.sprite.setFrame(this.chestFrameKeyPrefix + "1");
	}
	
	public setSpriteDepth(depth: number): void {
		this.sprite.setDepth(depth);
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number, onClick: () => any) {
		this.sprite = scene.add.sprite(x, y, config.atlasKeys.goldChestAtlasKey, this.chestFrameKeyPrefix + "1");
		this._onClick = onClick;
		this.sprite.setInteractive();
		this._registerButtonEvents();
		this.x = x;
		this.y = y;
	}
	//endregion

	//region private members
	private sprite: Phaser.GameObjects.Sprite;
  private readonly _onClick: () => any;
  private readonly chestFrameKeyPrefix = "chest_00";
  private readonly chestFrameCount = 6;
	private readonly chestAnimationSpeed = 23;
	private _active: boolean = true;
	//endregion

	//region private methods  
	private _registerButtonEvents(): void {
		this.sprite.on('pointerover', () => {
			if (!this._active) {
				return;
			}
			this.sprite.tint = 0xe0e0e0;
		});
		
		this.sprite.on('pointerout', () => {
			if (!this._active) {
				return;
			}
			this.sprite.tint = 0xffffff;
    });
    
		this.sprite.on('pointerup', () => {
			if (!this._active) {
				return;
			}
			this._onClick();
		});
	}
	//endregion
}