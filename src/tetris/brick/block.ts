/// <reference path="../../../definitions/phaser.d.ts"/>


import "phaser";
import Vector2 = Phaser.Math.Vector2;
import Brick from "tetris/brick/brick";

export default class Block {
	//region public members
	public set currentPositionIndex(currentPositionIndex: number) {
		this._currentPositionIndex = currentPositionIndex;
	}
	
	public get currentPosition() {
		return this._positions[this._currentPositionIndex];
	}

	public get positions() {
		return this._positions;
	}

	public destroy() {
		this._brick.blocks.splice(this._brick.blocks.indexOf(this), 1);
		this._sprite.setVisible(false);
		this._sprite.destroy();
	}

	public rotate(clockwise: boolean) {
		this._currentPositionIndex = (this._currentPositionIndex + (clockwise ? 1 : -1 )) % this._positions.length;
	}

	public move(movement: Vector2) {
		this._positions.forEach(p => p.add(movement));
		return this.currentPosition;
	}
	//endregion

	//region public methods
	public update(): void {
	}
	
	public preDraw(fieldDrawOffset: Vector2) {
		// convert from blocks to pixels
		let pixelPosition = this.currentPosition.clone().scale(this._sprite.frame.cutHeight);

		// get center position
		const blockCenter = new Vector2(this._sprite.frame.cutWidth, this._sprite.frame.cutHeight).scale(0.5);
		pixelPosition.add(blockCenter);

		// move to field position
		pixelPosition.add(fieldDrawOffset);

		this._sprite.setPosition(pixelPosition.x, pixelPosition.y);
	}
	
	public clone(): Block {
		const b = new Block(this._sprite, this._positions.map(p => p.clone()), this._brick);
		b._currentPositionIndex = this._currentPositionIndex;
		return b;
	}
	//endregion

	//region constructor
	public constructor(sprite: Phaser.GameObjects.Sprite, positions: Vector2[], brick: Brick) {
		this._sprite = sprite;
		this._brick = brick;
		this._positions = positions;
	}
	//endregion

	//region private members
	private _currentPositionIndex: number = 0;
	private _positions: Vector2[];
	private _brick: Brick;
	private _sprite: Phaser.GameObjects.Sprite;
	//endregion

	//region private methods
	//endregion
}
