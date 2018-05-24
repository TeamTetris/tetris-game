/// <reference path="../../../definitions/phaser.d.ts"/>


import "phaser";
import Vector2 = Phaser.Math.Vector2;

export default class Block {
	private _assetId: string;
	private _position: Vector2;

	public constructor(assetId: string, position: Vector2) {
		this._assetId = assetId;
		this.position = position;
	}

	get position() {
		return this._position;
	}

	set position(position: Vector2) {
		this._position = position;
	}
}