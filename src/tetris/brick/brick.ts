/// <reference path="../../../definitions/phaser.d.ts"/>


import "phaser";
import Vector2 = Phaser.Math.Vector2;
import Field from "tetris/field/field";
import Block from "tetris/brick/block";

export default class Brick {

	//region public members
	public get position(): Vector2 {
		return this._position;
	}

	public set position(position: Vector2) {
		this._position = position;
	}

	public get blocks(): Block[] {
		return this._blocks;
	}

	public get stateChanged(): boolean {
		return this._stateChanged;
	}
	
	public set stateChanged(changed: boolean) {
		this._stateChanged = changed;
	}
	
	public get custom() {
		return this._custom;
	}
	
	public set custom(custom: boolean) {
		this._custom = custom;
	}
	//endregion

	//region public methods
	public moveLeft(): void {
		this._tryToMove(new Vector2(-1, 0));
	}

	public moveRight(): void {
		this._tryToMove(new Vector2(1, 0));
	}

	public dropOne(): void {
		this._tryToMove(new Vector2(0, 1), true);
	}
	
	public dropToFloor(): number {
		let rowsDropped = 0;
		while (this._tryToMove(new Vector2(0, 1), true)) {
			rowsDropped++;
		}
		return rowsDropped;
	}

	public rotate(): void {
		this._tryToRotate(true);
	}

	public moveDown(): boolean {
		return this._tryToMove(new Vector2(0, 1), true);
	}

	public addBlock(sprite: Phaser.GameObjects.Sprite, positions: Vector2[]): void {
		const block = new Block(sprite, positions.map(p => p.add(this._position)), this);
		this.blocks.push(block);
	}

	public isStuck(): boolean {
		return this._stuck;
	}

	public checkIfStuck(): boolean {
		this._tryToMove(new Vector2(0, 1), true);
		return this.isStuck();
	}

	public update(time: number, delta: number): void {
		this._blocks.forEach(b => b.update());
	}

	public preDraw(fieldDrawOffset: Vector2) {
		this._blocks.forEach(b => b.preDraw(fieldDrawOffset));		
	}

	public destroy() {
		this._field = null;
		this._blocks.forEach(b => b.destroy());
		this._blocks = null;
	}
	//endregion

	//region constructor
	public constructor(position: Vector2, field: Field) {
		this.position = position;
		this._field = field;
		this._blocks = [];
	}
	//endregion

	//region private members
	private _position: Vector2;
	private _blocks: Block[];
	private _field: Field;
	private _custom: boolean = false;
	private _stuck: boolean = false;
	private _stateChanged: boolean = false;
	//endregion

	//region private methods
	private _tryToMove(move: Vector2, stuckIfFails: boolean = false): boolean {
		if (this._isMovePossible(move)) {
			this._blocks.forEach(b => b.move(move));
			this.position.add(move);
			this._stateChanged = true;
			return true;
		} else if (stuckIfFails) {
			this._stuck = true;
			return false;
		}
	}
	
	private _isMovePossible(move: Vector2): boolean {
		let possible = true;
		this._blocks.forEach(b => {
			const targetPosition = b.clone().move(move);
			if (this._field.isPositionBlocked(targetPosition)) {
				possible = false;
			}
		});
		return possible;
	}

	private _tryToRotate(clockwise: boolean): void {
		const rotatedBlocks = this._blocks.map(originalBlock => {
			let rotatedBlock = originalBlock.clone();
			rotatedBlock.rotate(clockwise);
			return rotatedBlock; 
		});

		if (this._isRotationPossible(rotatedBlocks)) {
			this._blocks = rotatedBlocks;
			this._stateChanged = true;
		}
	}

	private _isRotationPossible(rotatedBlocks: Block[]): boolean {
		let possible = true;
		rotatedBlocks.forEach(b => {
			const targetPosition = b.currentPosition;
			if (this._field.isPositionBlocked(targetPosition)) {
				possible = false;
			}
		});
		return possible;
	}
	//endregion
}
