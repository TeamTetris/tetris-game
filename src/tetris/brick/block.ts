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
	public update(brickPosition: Vector2): void {
		const fieldPosition = brickPosition.add(this._position).scale(this._sprite.getBounds().x);
		this._sprite.setPosition(fieldPosition.x, fieldPosition.y);
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
