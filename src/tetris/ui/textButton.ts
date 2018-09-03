/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import { Font } from "tetris/ui/scoreboardWidget";

export default class TextButton {

	//region public members
	public button: Phaser.GameObjects.Sprite;
	public text: Phaser.GameObjects.Text;
	//endregion

	//region public methods
	get height(): number {
		return this.button.height;
	}

	get width(): number {
		return this.button.width;
	}

	get x(): number {
		return this.button.x;
	}

	get y(): number {
		return this.button.y;
	}

	set x(x: number) {
		this.button.x = x;
		this._adjustTextX();
	}

	set y(y: number) {
		this.button.y = y;
		this._adjustTextY();
	}
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
			this._setVisualPressedState(true);
		});

		this.button.on('pointerup', () => {
			this._setVisualPressedState(false);			
			this._onClick();
		});

		this.button.on('pointerover', () => {
			this.button.tint = 0xe0e0e0;
		});
		
		this.button.on('pointerout', () => {
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
