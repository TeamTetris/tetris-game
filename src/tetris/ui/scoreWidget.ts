/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import { Font } from "tetris/ui/scoreboardWidget";

export default class ScoreWidget {

	//region public members
	public score: Phaser.GameObjects.Text;
	//endregion

	//region public methods
	get height(): number {
		return this.score.height;
	}

	get width(): number {
		return this.score.width;
	}

	get x(): number {
		return this.score.x;
	}

	get y(): number {
		return this.score.y;
	}

	set x(x: number) {
        this._x = x;
        this._adjustTextX();
	}

	set y(y: number) {
        this._y = y;
		this._adjustTextY();
	}

	public update(score: string): void {
        this.score.setText(score);
        this._adjustTextX();
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number, font: Font = config.ui.fonts.large) {
        this.score = scene.add.text(0, 0, "0", font.font);
		this.x = x;
		this.y = y;
	}
	//endregion

	//region private members
    private _x: number = 0;
    private _y: number = 0;
	//endregion

    //region private methods
    private _adjustTextX(): void {
        this.score.x = this._x - this.score.width / 2;
    }

    private _adjustTextY(): void {
        this.score.y = this._y - this.score.height / 2;
    }
	//endregion
}