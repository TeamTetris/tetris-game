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
	public update(): void {
	}
	
	public preDraw(brickPosition: Vector2, fieldOffset: Vector2) {
		const fieldPosition = brickPosition.clone().add(this._position);
		const pixelPosition = fieldPosition.clone().scale(this._sprite.frame.cutHeight).add(new Vector2(this._sprite.frame.cutWidth, this._sprite.frame.cutHeight).scale(0.5)).add(fieldOffset);
		this._sprite.setPosition(pixelPosition.x, pixelPosition.y);
	}
	//endregion

	//region constructor
	public constructor(sprite: Phaser.GameObjects.Sprite, position: Vector2) {
		this._sprite = sprite;
		this.position = position;
	}
	//endregion

	//region private members
	private _position: Vector2;
	private _sprite: Phaser.GameObjects.Sprite;
	//endregion

	//region private methods
	//endregion
}
