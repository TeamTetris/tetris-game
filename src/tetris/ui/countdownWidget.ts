/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import { ScaleModes } from "phaser";

export default class CountdownWidget {

	//region public members
	public titleText: Phaser.GameObjects.BitmapText;
	public countdownText: Phaser.GameObjects.BitmapText;
	public circle: Phaser.GameObjects.Graphics;

	public get height(): number {
		return this._radius * 2;
	}

	public get width(): number {
		return this._radius * 2;
	}

	public get x(): number {
		return this.circle.x;
	}

	public get y(): number {
		return this.circle.y;
	}

	public set x(x: number) {
		this.circle.x = x;
		this._adjustTextX();
	}

	public set y(y: number) {
		this.circle.y = y;
		this._adjustTextY();
	}
	//endregion

	//region public methods
	public update(time: number, totalTime: number, preGame: boolean): void {
		if (totalTime <= 0) {
			console.error(`Can't update countdown with total time smaller or equal 0. totalTime: ${totalTime}`);
			return;
		}
		if (time < 0) {
			console.error(`Can't update countdown with time smaller 0. time: ${time}`);
			return;
		}

		// Redraw countdown widget
		const percentage = time * 100 / totalTime;
		this._updateCircle(percentage);
		this._updateText(percentage, time, preGame);
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number) {
		this.circle = scene.add.graphics();
		this.titleText = scene.add.bitmapText(0, 0, config.ui.fontKeys.kenneyMiniSquare, " \n ", config.ui.fonts.countdown.size);
		this.titleText.setScaleMode(ScaleModes.NEAREST);
		this.titleText.setCenterAlign();
		this.countdownText = scene.add.bitmapText(0, 0, config.ui.fontKeys.kenneyMiniSquare, "0", config.ui.fonts.large.size);
		this.countdownText.setScaleMode(ScaleModes.NEAREST);
		this.countdownText.setCenterAlign();
		this.x = x;
		this.y = y;
	}
	//endregion

	//region private members
	private readonly _radius = config.graphics.width / 15;
	//endregion

	//region private methods
	private _updateCircle(percentage: number): void {
		const startRad = Phaser.Math.DegToRad(270);
		const endRad = CountdownWidget._phaserRadius(percentage);
		
		this.circle.clear();
		this._setColors(percentage);
		this.circle.beginPath();
		if (percentage === 100) {
			this.circle.arc(0, 0, this._radius, startRad, Phaser.Math.DegToRad(269), false);
			this.circle.closePath();
		} else {
			this.circle.arc(0, 0, this._radius, startRad, endRad, false);
		}
		
		this.circle.strokePath();
	}

	private _updateText(percentage: number, time: number, preGame: boolean): void {
		if (preGame) {
			this.titleText.setText("Match\nstarts in")
		} else {
			this.titleText.setText("Next\nElimination")
		}

		if (percentage < 25) {
			this.countdownText.setText(time.toFixed(1).toString());
		} else {
			this.countdownText.setText(time.toFixed(0).toString());
		}
		this._adjustTextX();
	}

	private _setColors(percentage: number): void {
		if (percentage < 25) {
			this.circle.lineStyle(config.ui.countdown.lineWidth, config.ui.colors.red.hex);
			this.titleText.setTint(config.ui.colors.red.hex);
			this.countdownText.setTint(config.ui.colors.red.hex);
		} else if (percentage < 50) {
			this.circle.lineStyle(config.ui.countdown.lineWidth, config.ui.colors.orange.hex);
			this.titleText.setTint(config.ui.colors.orange.hex);
			this.countdownText.setTint(config.ui.colors.orange.hex);
		} else if (percentage < 75) {
			this.circle.lineStyle(config.ui.countdown.lineWidth, config.ui.colors.yellow.hex);
			this.titleText.setTint(config.ui.colors.yellow.hex);
			this.countdownText.setTint(config.ui.colors.yellow.hex);
		} else {
			this.circle.lineStyle(config.ui.countdown.lineWidth, config.ui.colors.white.hex);
			this.titleText.setTint(config.ui.colors.white.hex);
			this.countdownText.setTint(config.ui.colors.white.hex);
		}
	}

	private _adjustTextX(): void {
		this.titleText.x = this.x - this.titleText.width / 2;
        this.countdownText.x = this.x - this.countdownText.width / 2;
    }

    private _adjustTextY(): void {
		this.titleText.y = this.y - this.titleText.height;
        this.countdownText.y = this.y;
    }

	private static _phaserRadius(percentage: number): number {
		const deg = percentage * 360 / 100;
		return Phaser.Math.DegToRad(deg + 270 % 360);
	}
	//endregion
}
