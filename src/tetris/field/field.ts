/// <reference path="../../../definitions/phaser.d.ts"/>

import Brick from '../brick/brick';
import Block from '../brick/block';
import BrickFactory from '../brick/brickFactory';

export default class Field {

    private _activeBrick: Brick;
    private readonly _width: integer;
    private readonly _height: integer;
    private readonly _brickFactory: BrickFactory;

	// contains only stuck bricks
	private readonly _bricks: Brick[];
	private readonly _state: boolean[][];

    public constructor(width: number, height: number, brickFactory: BrickFactory) {
        this._width = width;
        this._height = height;
        this._bricks = [];
        this._brickFactory = brickFactory;
		this._state = new Array(this._height);
		this._setupField();
    }

    private _setupField() {
        const iterator = this._state.keys();
        for (let key of iterator) {
            this._state[key] = new Array(this._width).fill(false);
        }
    }

    private _addToField(blocks: Block[]) {
        blocks.forEach(block => {
			this._state[block.position.x][block.position.y] = true;
        });
    }

    public addBrick(brick: Brick) {
        this._bricks.push(brick);
    }

    set activeBrick(brick: Brick) {
        this._activeBrick = brick;
    }

    get activeBrick(): Brick {
        return this._activeBrick;
    }

    get state(): boolean[][] {
        return this._state;
    }

    public update(time: number, delta: number) {
        if (!this.activeBrick) {
            this.activeBrick = this._brickFactory.newBrick(this);
        }
        this._activeBrick.update(time, delta);
        if (this.activeBrick.isStuck()) {
            this._addToField(this._activeBrick.blocks);
            this.addBrick(this.activeBrick);
            this.activeBrick = null;
        }
    }

}