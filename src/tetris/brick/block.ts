/// <reference path="../../../definitions/phaser.d.ts"/>


import "phaser";
import Vector2 = Phaser.Math.Vector2;
import Brick from "tetris/brick/brick";
import config from "tetris/config";

export default class Block {
	//region public members
	public set currentPositionIndex(currentPositionIndex: number) {
		this._currentPositionIndex = currentPositionIndex;
	}
	
	public get currentPosition(): Vector2 {
		return this._positions[this._currentPositionIndex];
	}

	public get spriteFrameName(): string {
		return this._sprite.frame.name;
	}

	public get positions(): Vector2[] {
		return this._positions;
	}

	public get sprite(): Phaser.GameObjects.Sprite {
		return this._sprite;
	}
	//endregion

	//region public methods
	public destroy(): void {
		this._sprite.destroy();
		this._sprite = null;
	}

	public rotate(clockwise: boolean): void {
		this._currentPositionIndex = (this._currentPositionIndex + (clockwise ? 1 : -1 )) % this._positions.length;
	}

	public move(movement: Vector2): Vector2 {
		this._positions.forEach(p => p.add(movement));
		return this.currentPosition;
	}
	
	public update(): void {

	}
	
	public preDraw(fieldDrawOffset: Vector2, drawScale: number = 1): void {
		if (!this.sprite) {
			return;
		}
		// only display blocks that are below the field ceiling
		if (this.currentPosition.y < 0) {
			this._sprite.setVisible(false);
		} else {
			this._sprite.setVisible(true);
		}

		if (drawScale != 1) {
			this.sprite.setScale(drawScale, drawScale);
		}

		// convert from blocks to pixels
		let pixelPosition = this.currentPosition.clone().scale(config.field.blockSize * drawScale);

		// get center position
		const blockCenter = new Vector2(config.field.blockSize, config.field.blockSize).scale(0.5 * drawScale);
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
