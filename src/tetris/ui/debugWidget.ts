/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import Font from 'tetris/interfaces/Font';

export default class DebugWidget {

	//region public members
	public debugInformation: Phaser.GameObjects.Text[];
	
	public get height(): number {
		return this.debugInformation.length * config.ui.fonts.small.size;
	}

	public get width(): number {
		return Math.max.apply(Math, this.debugInformation.map((line) => {
			return line.width;
		}));
	}

	public get x(): number {
		return this._x;
	}

	public get y(): number {
		return this._y;
	}

	public get displayed(): boolean {
		return this._displayed;
	}
 
	public set x(x: number) {
        this._x = x;
        this._adjustTextX();
	}

	public set y(y: number) {
        this._y = y;
		this._adjustTextY();
	}
	//endregion

	//region public methods
	public update(debugInformationText: string[]): void {
		const missingLines = debugInformationText.length - this.debugInformation.length;
		if (missingLines) {
			for (let i = 0; i < missingLines; i++) {
				const line = this._scene.add.text(this._x, this._y, "", this._font.font);
				line.setVisible(this._displayed);
				this.debugInformation.push(line);
			}
			this._adjustTextY();
		}

		for (const [index, text] of debugInformationText.entries()) {
			this.debugInformation[index].setText(text);
		}
        this._adjustTextX();
	}

	public toggleVisibility(): void {
		this._displayed = !this.displayed;
		console.log(this._displayed);
		for (const line of this.debugInformation) {
			line.setVisible(this._displayed);
		}
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number, font: Font = config.ui.fonts.scoreboard) {
		this._scene = scene;
		this._font = font;
		this.debugInformation = [];
		this.x = x;
		this.y = y;
		this._displayed = false;
	}
	//endregion

	//region private members
    private _x: number = 0;
	private _y: number = 0;
	private _scene: Phaser.Scene;
	private _font: Font;
	private _displayed: boolean;
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
