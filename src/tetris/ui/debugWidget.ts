/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import Font from 'tetris/interfaces/Font';

export default class DebugWidget {

	//region public members
	public debugInformation: Phaser.GameObjects.Text[];
	//endregion

	//region public methods
	get height(): number {
		return this.debugInformation.length * config.ui.fonts.small.size;
	}

	get width(): number {
		return Math.max.apply(Math, this.debugInformation.map((line) => {
			return line.width;
		}));
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	set x(x: number) {
        this._x = x;
        this._adjustTextX();
	}

	set y(y: number) {
        this._y = y;
		this._adjustTextY();
	}

	public update(debugInformationText: string[]): void {
		const missingLines = debugInformationText.length - this.debugInformation.length;
		if (missingLines) {
			for (let i = 0; i < missingLines; i++) {
				this.debugInformation.push(this._scene.add.text(this._x, this._y, "", this._font.font));
				console.log('added text');
			}
			this._adjustTextY();
		}

		for (const [index, text] of debugInformationText.entries()) {
			this.debugInformation[index].setText(text);
		}
        this._adjustTextX();
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number, font: Font = config.ui.fonts.small) {
		this._scene = scene;
		this._font = font;
		this.debugInformation = [];
		this.x = x;
		this.y = y;
	}
	//endregion

	//region private members
    private _x: number = 0;
	private _y: number = 0;
	private _scene: Phaser.Scene;
	private _font: Font;
	//endregion

    //region private methods
    private _adjustTextX(): void {
		for (const line of this.debugInformation) {
			line.x = this.x;
		}
    }

    private _adjustTextY(): void {
		for (const [index, line] of this.debugInformation.entries()) {
			line.y = this.y + index * this._font.size;
		}
    }
	//endregion
}
