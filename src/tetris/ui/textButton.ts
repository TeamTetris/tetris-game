/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";

export default class TextButton {

	//region public members
	public button: Phaser.GameObjects.Sprite;
	public text: Phaser.GameObjects.Text;
	//endregion

	//region public methods
	get height() {
		return this.button.height;
	}

	get width() {
		return this.button.width;
	}

	get x() {
		return this.button.x;
	}

	get y() {
		return this.button.y;
	}

	set x(x: number) {
		this.button.x = x;
		this._setTextX(x);
	}

	set y(y: number) {
		this.button.y = y;
		this._setTextY(y);
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number, buttonSpriteUp: string, buttonSpriteDown: string, text: string, onClick: () => any, fontStyle?: object) {
		this.button = scene.add.sprite(x, y, config.atlasKeys.uiSpriteAtlasKey, buttonSpriteUp);
		if (fontStyle) {
			this.text = scene.add.text(0, 0, text, fontStyle);
		} else {
			this.text = scene.add.text(0, 0, text, config.ui.fonts.small.font);
		}
		this._buttonSpriteDown = buttonSpriteDown;
		this._buttonSpriteUp = buttonSpriteUp;
		this._onClick = onClick;
		this.button.setInteractive();
		this._registerButtonEvents();
		
		this._setTextX(x);
		this._setTextY(y);
	}
	//endregion

	//region private members
	private _onClick: () => any;
	private readonly _buttonSpriteUp: string;
	private readonly _buttonSpriteDown: string;
	private _buttonPressed: boolean = false;
	//endregion

	//region private methods
	private _setTextX(x: number) {
		this.text.x = x - this.text.width / 2;
	}

	private _setTextY(y: number) {
		this.text.y = y - this.text.height / 2 - 4;
	}

	private _setVisualPressedState(pressed: boolean) {
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

	private _registerButtonEvents() {
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
	//endregion
}
