/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";

export default class CountdownWidget {

	//region public members
	public text: Phaser.GameObjects.Text;
	public circle: Phaser.GameObjects.Graphics;
	//endregion

	//region public methods
	get height() {
		return this._radius * 2;
	}

	get width() {
		return this._radius * 2;
	}

	get x() {
		return this.circle.x;
	}

	get y() {
		return this.circle.y;
	}

	set x(x: number) {
		this.circle.x = x;
		this._adjustTextPosition();
	}

	set y(y: number) {
		this.circle.y = y;
		this._adjustTextPosition();
	}

	public update(time: number, totalTime: number) {
		if (totalTime <= 0) {
			throw new Error(`Can't update countdown with total time smaller or equal 0. totalTime: ${totalTime}`);
		}
		if (time < 0) {
			throw new Error(`Can't update countdown with time smaller 0. time: ${time}`);
		}

		// Redraw countdown widget
		const percentage = time * 100 / totalTime;
		this._updateCircle(percentage);
		this._updateText(percentage, time)
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number) {
		this.circle = scene.add.graphics();
		this.text = scene.add.text(0, 0, "0", config.defaultLargeFontStyle);
		this.x = x;
		this.y = y;
		this.update(30, 30);
	}
	//endregion

	//region private members
	private readonly _radius = config.graphics.width / 15;
	//endregion

	//region private methods
	private _updateCircle(percentage: number) {
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

	private _updateText(percentage: number, time: number) {
		if (percentage < 25) {
			this.text.setText(time.toFixed(3).toString());
		} else {
			this.text.setText(time.toFixed(0).toString());
		}
		this._adjustTextPosition();
	}

	private _setColors(percentage: number) {
		if (percentage < 25) {
			this.circle.lineStyle(config.ui.countdown.lineWidth, config.ui.colors.red.hex);
			this.text.setColor(config.ui.colors.red.string);
		} else if (percentage < 50) {
			this.circle.lineStyle(config.ui.countdown.lineWidth, config.ui.colors.orange.hex);
			this.text.setColor(config.ui.colors.orange.string);
		} else if (percentage < 75) {
			this.circle.lineStyle(config.ui.countdown.lineWidth, config.ui.colors.yellow.hex);
			this.text.setColor(config.ui.colors.yellow.string);
		} else {
			this.circle.lineStyle(config.ui.countdown.lineWidth, config.ui.colors.white.hex);
			this.text.setColor(config.ui.colors.white.string);
		}
	}
	
	private _adjustTextPosition() {
		this.text.x = this.x - this.text.width / 2;
		this.text.y = this.y - this.text.height / 1.5;
	}

	private static _phaserRadius(percentage: number) {
		const deg = percentage * 360 / 100;
		return Phaser.Math.DegToRad(deg + 270 % 360);
	}
	//endregion
}
