/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import Font from "tetris/interfaces/Font";

export default class TextButton {

	//region public members
	public button: Phaser.GameObjects.Sprite;
	public text: Phaser.GameObjects.Text;

	public get height(): number {
		return this.button.height;
	}

	public get width(): number {
		return this.button.width;
	}

	public get x(): number {
		return this.button.x;
	}

	public get y(): number {
		return this.button.y;
	}

	public set x(x: number) {
		this.button.x = x;
		this._adjustTextX();
	}

	public set y(y: number) {
		this.button.y = y;
		this._adjustTextY();
	}

	public set active(active: boolean) {
		if (!active && this._active) {
			this._setVisualPressedState(false);
		}
		this._active = active;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number, buttonSpriteUp: string, buttonSpriteDown: string, text: string, onClick: () => any, font: Font = config.ui.fonts.small) {
		this.button = scene.add.sprite(0, 0, config.atlasKeys.uiSpriteAtlasKey, buttonSpriteUp);
		this.text = scene.add.text(0, 0, text, font.font);
		this._buttonSpriteDown = buttonSpriteDown;
		this._buttonSpriteUp = buttonSpriteUp;
		this._onClick = onClick;
		this.button.setInteractive();
		this._registerButtonEvents();
		this.x = x;
		this.y = y;
	}
	//endregion

	//region private members
	private readonly _onClick: () => any;
	private readonly _buttonSpriteUp: string;
	private readonly _buttonSpriteDown: string;
	private _buttonPressed: boolean = false;
	private _active: boolean = true;
	//endregion

	//region private methods
	private _setVisualPressedState(pressed: boolean): void {
		if (pressed == this._buttonPressed) {
			return;
		}
		this._buttonPressed = pressed;
		if (pressed) {
			this.button.setFrame(this._buttonSpriteDown);
			this.button.y += 4;
			this.text.y += 4;
		} else {
			this.button.setFrame(this._buttonSpriteUp);
			this.button.y -= 4;
			this.text.y -= 4;
		}
	}

	private _registerButtonEvents(): void {
		this.button.on('pointerdown', () => {
			if (!this._active) {
				return;
			}
			this._setVisualPressedState(true);
		});

		this.button.on('pointerup', () => {
			if (!this._active) {
				return;
			}
			this._setVisualPressedState(false);			
			this._onClick();
		});

		this.button.on('pointerover', () => {
			if (!this._active) {
				return;
			}
			this.button.tint = 0xe0e0e0;
		});
		
		this.button.on('pointerout', () => {
			if (!this._active) {
				return;
			}
			this.button.tint = 0xffffff;
			if (this._buttonPressed) {
				this._setVisualPressedState(false);
			}
		});
	}

	private _adjustTextX(): void {
        this.text.x = this.x - this.text.width / 2;
    }

    private _adjustTextY(): void {
        this.text.y = this.y - this.text.height / 2 - 4;
    }
	//endregion
}
