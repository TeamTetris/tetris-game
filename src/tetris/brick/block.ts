/// <reference path="../../../definitions/phaser.d.ts"/>


import "phaser";
import Vector2 = Phaser.Math.Vector2;
import Brick from "tetris/brick/brick";

export default class Block {
	//region public members
	public set position(position: Vector2) {
		this._position = position;
	}
	
	public get position() {
		return this._position;
	}

	public destroy() {
		this._brick.blocks.splice(this._brick.blocks.indexOf(this), 1);
		this._sprite.setVisible(false);
		this._sprite.destroy();
	}
	//endregion

	//region public methods
	public update(): void {
	}
	
	public preDraw(fieldDrawOffset: Vector2) {
		// convert from blocks to pixels
		let pixelPosition = this.position.clone().scale(this._sprite.frame.cutHeight);

		// get center position
		const blockCenter = new Vector2(this._sprite.frame.cutWidth, this._sprite.frame.cutHeight).scale(0.5);
		pixelPosition.add(blockCenter);

		// move to field position
		pixelPosition.add(fieldDrawOffset);

		this._sprite.setPosition(pixelPosition.x, pixelPosition.y);
	}
	
	public clone(): Block {
		return new Block(this._sprite, this._position, this._brick);
	}
	//endregion

	//region constructor
	public constructor(sprite: Phaser.GameObjects.Sprite, position: Vector2, brick: Brick) {
		this._sprite = sprite;
		this._brick = brick;
		this._position = position;
	}
	//endregion

	//region private members
	private _position: Vector2;
	private _brick: Brick;
	private _sprite: Phaser.GameObjects.Sprite;
	//endregion

	//region private methods
	//endregion
}
