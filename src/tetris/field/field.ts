/// <reference path="../../../definitions/phaser.d.ts"/>

import Brick from 'tetris/brick/brick';
import Block from 'tetris/brick/block';
import BrickFactory from 'tetris/brick/brickFactory';
import FieldState from 'tetris/field/fieldState';
import BiasEventReceiver from "tetris/biasEngine/biasEventReceiver";
import BiasEventType from "tetris/biasEngine/biasEventType";
import Vector2 = Phaser.Math.Vector2;

export default class Field {

	//region public members
	public get serializedBlockState(): Object {
		const serializedBlocks = [];
		for (const blockRow of this._blockRows)  {
			const serializedBlockRow = [];
			for (const block of blockRow) {
				serializedBlockRow.push(block ? { spriteFrameName: block.spriteFrameName } : null);
			}
			serializedBlocks.push(serializedBlockRow);
		}
		if (this.activeBrick) {
			for (const block of this.activeBrick.blocks) {
				if (!this.isPositionOutOfBounds(block.currentPosition, true)) {
					serializedBlocks[block.currentPosition.y][block.currentPosition.x] = { spriteFrameName: block.spriteFrameName };
				}
			}
		}
		return serializedBlocks;
	}

	public get blockStateChanged(): boolean {
		return this._blockStateChanged;
	}
	
	public set blockStateChanged(changed: boolean) {
		this._blockStateChanged = changed;
	}

	public get fieldStateChanged(): boolean {
		return this._fieldStateChanged;
	}

	public set fieldStateChanged(fieldState: boolean) {
		this._fieldStateChanged = fieldState;
	}

	public get fieldState(): FieldState {
		return this._fieldState;
	}
	
	public set fieldState(fieldState: FieldState) {
		if (this._fieldState !== fieldState) {
			this._fieldStateChanged = true;
			this._fieldState = fieldState;
		}
	}

	public get activeBrick(): Brick {
		return this._activeBrick;
	}
	
	public set activeBrick(brick: Brick) {
		this._activeBrick = brick;
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

	public get score(): number {
		return this._score;
	}
	//endregion

	//region public methods
	public addMoveBonusPoints(rows: number = 1): void {
		this._score += this._movePointsMultiplicator * rows;
	}

	public update(time: number, delta: number): void {
		if (this._fieldState != FieldState.Playing) {
			return;
		}
		if (this._biasEventReceiver.has(BiasEventType.FreezeLocalField)) {
			return;
		}
		if (!this.activeBrick) {
			this._generateNewBrick(time);
			this._blockStateChanged = true;
		} else {
			if (this._nextActiveBrickDrop <= time) {
				this._nextActiveBrickDrop = time + this._activeBrickDropInterval;
				this.activeBrick.dropOne();
				this._blockStateChanged = true;
			}

			this.activeBrick.update(time, delta);
			
			if (this.activeBrick.stateChanged) {
				this.activeBrick.stateChanged = false;
				this._blockStateChanged = true;				
			}
		}
		if (this.activeBrick.isStuck()) {
			this._addToField(this.activeBrick.blocks);
			this.addBrick(this.activeBrick);
			this._activeBrick = null;

			const deletedRows = this._deleteCompletedRows();
			if (deletedRows > 0) {
				this._increaseScore(deletedRows);
			}
			this._blockStateChanged = true;
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

	public reset(): void {
		for (const blockRow of this._blockRows)  {
			for (const block of blockRow) {
				if (block) {
					block.destroy();
				}
			}
		}
		this._score = 0;
		this._setupField();
		if (this.activeBrick) {
			this.activeBrick.destroy();
		}
		this.activeBrick = null;
		this.fieldState = FieldState.Playing;
		this.fieldStateChanged = false;
	}
	//endregion

	//region constructor
	public constructor(width: number,
					   height: number,
					   drawOffset: Vector2,
					   brickFactory: BrickFactory,
					   biasEventReceiver: BiasEventReceiver) {
		this._width = width;
		this._height = height;
		this._biasEventReceiver = biasEventReceiver.addFilter(BiasEventType.FreezeLocalField);
		this._drawOffset = drawOffset;
		this._bricks = [];
		this._brickFactory = brickFactory;
		this._blockRows = new Array(this._height);
		this._setupField();
	}
	//endregion

	//region private members
	private _activeBrick: Brick;
	private readonly _width: integer;
	private readonly _biasEventReceiver: BiasEventReceiver;
	private readonly _height: integer;
	private readonly _drawOffset: Vector2;
	private readonly _brickFactory: BrickFactory;
	private readonly _rowPointsMultiplicator: number = 1000;
	private readonly _movePointsMultiplicator: number = 3;

	private _nextActiveBrickDrop: number;
	private _activeBrickDropInterval: number = 400;
	private _score: number = 0;

	private _fieldState: FieldState = FieldState.Playing;
	private _fieldStateChanged: boolean = false;

	// contains only stuck bricks
	private readonly _bricks: Brick[];
	private readonly _blockRows: Block[][];
	private _blockStateChanged = false;
	//endregion

	//region private methods
	private _generateNewBrick(time: number): void {
		this._activeBrick = this._brickFactory.newBrick(this);
		this._nextActiveBrickDrop = time + this._activeBrickDropInterval;
		if (this._activeBrick.checkIfStuck()) {
			this.fieldState = FieldState.Loss;
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
				this._dropRow(backtrackedRowIndex);
			}
		});

		return rowsDeleted;
	}

	private _dropRow(rowIndex: number) {
		this._blockRows[rowIndex].forEach((block, blockIndex) => {
			if (block === null) {
				return;
			}
			block.move(new Vector2(0, 1));
			this._blockRows[rowIndex + 1][blockIndex] = block;
			this._blockRows[rowIndex][blockIndex] = null;
		});
	}

	private _increaseScore(deletedRows: number): void {
		this._score += deletedRows * this._rowPointsMultiplicator;
	}
	//endregion
}
