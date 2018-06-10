/// <reference path="../../../definitions/phaser.d.ts"/>

import Brick from 'tetris/brick/brick';
import Block from 'tetris/brick/block';
import BrickFactory from 'tetris/brick/brickFactory';
import Vector2 = Phaser.Math.Vector2;
import FieldState from 'tetris/field/fieldState';

export default class Field {

	//region public members
	public get activeBrick(): Brick {
		return this._activeBrick;
	}

	public get blocks(): Block[][] {
		return this._blockRows;
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
		if (this._fieldState != FieldState.Playing) {
			return;
		}

		if (!this.activeBrick) {
			this._generateNewBrick(time);
		} else {
			if (this._nextActiveBrickDrop <= time) {
				this._nextActiveBrickDrop = time + this._activeBrickDropInterval;
				this.activeBrick.dropOne();
			}
			this.activeBrick.update(time, delta);
		}
		if (this.activeBrick.isStuck()) {
			this._addToField(this.activeBrick.blocks);
			this.addBrick(this.activeBrick);
			this._activeBrick = null;

			const deletedRows = this._deleteCompletedRows();
			if (deletedRows > 0) {
				this._increaseScore(deletedRows);
			}
		}

		this.preDraw();
	}

	public preDraw(): void {
		this._bricks.forEach(b => b.preDraw(this._drawOffset));

		if (this.activeBrick) {
			this.activeBrick.preDraw(this._drawOffset);
		}
	}

	public addBrick(brick: Brick): void {
		this._bricks.push(brick);
	}
	
	public isPositionBlocked(position: Vector2): boolean {
		return (this.isPositionOutOfBounds(position, false)
			|| (position.y >= 0 && !!this.blocks[position.y][position.x]));
	}

	public isPositionOutOfBounds(position: Vector2, checkCeiling: boolean): boolean {
		return (position.x < 0
			|| (checkCeiling && position.y < 0)
			|| position.x >= this.width
			|| position.y >= this.height);
	}
	//endregion

	//region constructor
	public constructor(width: number,
					   height: number,
					   drawOffset: Vector2,
					   scoreText: Phaser.GameObjects.Text,
					   brickFactory: BrickFactory) {
		this._width = width;
		this._height = height;
		this._drawOffset = drawOffset;
		this._bricks = [];
		this._scoreText = scoreText;
		this._brickFactory = brickFactory;
		this._blockRows = new Array(this._height);
		this._setupField();
	}
	//endregion

	//region private members
	private _activeBrick: Brick;
	private readonly _width: integer;
	private readonly _height: integer;
	private readonly _drawOffset: Vector2;
	private readonly _scoreText: Phaser.GameObjects.Text;
	private readonly _brickFactory: BrickFactory;

	private _nextActiveBrickDrop: number;
	private _activeBrickDropInterval: number = 400;
	private _score: number = 0;

	private _fieldState: FieldState = FieldState.Playing;

	// contains only stuck bricks
	private readonly _bricks: Brick[];
	private readonly _blockRows: Block[][];
	//endregion

	//region private methods
	private _generateNewBrick(time: number): void {
		this._activeBrick = this._brickFactory.newBrick(this);
		this._nextActiveBrickDrop = time + this._activeBrickDropInterval;
		if (this._activeBrick.checkIfStuck()) {
			this._fieldState = FieldState.Loss;
		}
	}

	private _setupField(): void {
		const iterator = this._blockRows.keys();
		for (let key of iterator) {
			this._blockRows[key] = new Array(this._width).fill(null);
		}
	}

	private _addToField(blocks: Block[]): void {
		blocks.forEach(block => {
			if (this.isPositionOutOfBounds(block.currentPosition, true)) {
				return;
			}
			this._blockRows[block.currentPosition.y][block.currentPosition.x] = block;
		});
	}

	private _deleteCompletedRows(): number {
		let rowsDeleted = 0;
		this._blockRows.forEach((row, rowIndex) => {
			let rowCompleted = row.every(block => block !== null);

			if (!rowCompleted) {
				return;
			}

			rowsDeleted += 1;

			row.forEach((block, blockIndex) => { 
				block.destroy(); 
				row[blockIndex] = null;
			});

			for (let backtrackedRowIndex = rowIndex; backtrackedRowIndex >= 0; backtrackedRowIndex--) {
				this._blockRows[backtrackedRowIndex].forEach((block, blockIndex) => {
					if (block !== null) {
						block.move(new Vector2(0, 1));
						this._blockRows[backtrackedRowIndex + 1][blockIndex] = block;
						this._blockRows[backtrackedRowIndex][blockIndex] = null;
					}
				})
			}
		})
			

		return rowsDeleted;
	}

	private _increaseScore(deletedRows: number): void {
		this._score += deletedRows * 100;
		this._scoreText.setText(this._score.toString());
	}
	//endregion
}
