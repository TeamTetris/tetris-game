/// <reference path="../../../definitions/phaser.d.ts"/>

import Brick from 'tetris/brick/brick';
import Block from 'tetris/brick/block';
import BrickFactory from 'tetris/brick/brickFactory';
import Vector2 = Phaser.Math.Vector2;

export default class Field {

	//region public members
	public addBrick(brick: Brick): void {
		this._bricks.push(brick);
	}

	public set activeBrick(brick: Brick) {
		this._activeBrick = brick;
	}

	public get activeBrick(): Brick {
		return this._activeBrick;
	}

	public get state(): boolean[][] {
		return this._state;
	}

	public get bricks(): Brick[] {
		return this._bricks;
	}

	public get width(): number {
		return this._width;
	}

	public get height(): number {
		return this._height;
	}
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		if (!this.activeBrick) {
			this._generateNewBrick(time);
		} else {
			if (this._nextActiveBrickDrop < time) {
				this._nextActiveBrickDrop = time + this._activeBrickDropInterval;
				this.activeBrick.dropOne();
			}
			this.activeBrick.update(time, delta);
		}
		if (this.activeBrick.isStuck()) {
			this._addToField(this.activeBrick.blocks, this.activeBrick.position);
			this.addBrick(this.activeBrick);
			this._generateNewBrick(time);
		}

		// Pre-Draw
		this._bricks.forEach(b => b.preDraw(this._drawOffset));
		this.activeBrick.preDraw(this._drawOffset);
	}
	//endregion

	//region constructor
	public constructor(width: number, height: number, drawOffset: Vector2, brickFactory: BrickFactory) {
		this._width = width;
		this._height = height;
		this._drawOffset = drawOffset;
		this._bricks = [];
		this._brickFactory = brickFactory;
		this._state = new Array(this._height);
		this._setupField();
	}
	//endregion

	//region private members
	private _activeBrick: Brick;
	private readonly _width: integer;
	private readonly _height: integer;
	private readonly _drawOffset: Vector2;
	private readonly _brickFactory: BrickFactory;

	private _nextActiveBrickDrop: number;
	private _activeBrickDropInterval: number = 400;

	// contains only stuck bricks
	private readonly _bricks: Brick[];
	private readonly _state: boolean[][];
	//endregion

	//region private methods
	private _generateNewBrick(time: number): void {
		this.activeBrick = this._brickFactory.newBrick(this);
		this.activeBrick.field = this;
		this._nextActiveBrickDrop = time + this._activeBrickDropInterval;
	}

	private _setupField(): void {
		const iterator = this._state.keys();
		for (let key of iterator) {
			this._state[key] = new Array(this._width).fill(false);
		}
	}

	private _addToField(blocks: Block[], brickOffset: Vector2): void {
		blocks.forEach(block => {
			this._state[brickOffset.x + block.position.x][brickOffset.y + block.position.y] = true;
		});
	}
	//endregion
}
