/// <reference path="../../../definitions/phaser.d.ts"/>

import Brick from 'tetris/brick/brick';
import Block from 'tetris/brick/block';
import BrickFactory from 'tetris/brick/brickFactory';

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
			this.activeBrick = this._brickFactory.newBrick(this);
		} else {
			this.activeBrick.update(time, delta);
		}
		if (this.activeBrick.isStuck()) {
			this._addToField(this.activeBrick.blocks);
			this.addBrick(this.activeBrick);
			this.activeBrick = null;
		}
	}
	//endregion

	//region constructor
	public constructor(width: number, height: number, brickFactory: BrickFactory) {
		this._width = width;
		this._height = height;
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
	private readonly _brickFactory: BrickFactory;

	// contains only stuck bricks
	private readonly _bricks: Brick[];
	private readonly _state: boolean[][];
	//endregion

	//region private methods
	private _setupField(): void {
		const iterator = this._state.keys();
		for (let key of iterator) {
			this._state[key] = new Array(this._width).fill(false);
		}
	}

	private _addToField(blocks: Block[]): void {
		blocks.forEach(block => {
			this._state[block.position.x][block.position.y] = true;
		});
	}
	//endregion
}
