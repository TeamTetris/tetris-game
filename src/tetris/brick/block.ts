/// <reference path="../../../definitions/phaser.d.ts"/>


import "phaser";
import Vector2 = Phaser.Math.Vector2;

export default class Block {

	//region public members
	public get position(): Vector2 {
		return this._position;
	}

	public set position(position: Vector2) {
		this._position = position;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(assetId: string, position: Vector2) {
		this._assetId = assetId;
		this.position = position;
	}
	//endregion

	//region private members
	private _assetId: string;
	private _position: Vector2;
	//endregion

	//region private methods
	//endregion
}
