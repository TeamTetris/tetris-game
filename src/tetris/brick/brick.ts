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

	public set field(field: Field) {
		this._field = field;
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
	
	public dropToFloor(): void {
		
	}

	public rotate(): void {
		// TODO: Implement
		// standard one-way rotation (clockwise)
	}

	public moveDown(): void {
		this._tryToMove(new Vector2(0, 1), true);
	}

	public addBlock(sprite: Phaser.GameObjects.Sprite, relativePosition: Vector2): void {
		const block = new Block(sprite, relativePosition);
		this._blocks = this.blocks.concat(block);
	}

	public isStuck(): boolean {
		// TODO: implement me
		return this._stuck;
	}

	public update(time: number, delta: number): void {
		this._blocks.forEach(b => b.update());
	}

	public preDraw(fieldOffset: Vector2) {
		this._blocks.forEach(b => b.preDraw(this._position, fieldOffset));		
	}
	//endregion

	//region constructor
	public constructor(position: Vector2) {
		this.position = position;
		this._blocks = [];
	}
	//endregion

	//region private members
	private _position: Vector2;
	private _blocks: Block[];
	private _field: Field;
	private _stuck: boolean = false;
	//endregion

	//region private methods
	private _tryToMove(move: Vector2, stuckIfFails: boolean = false): void {
		if (this._isMovePossible(move)) {
			this.position.add(move);		
		} else if (stuckIfFails) {
			this._stuck = true;
		}
	}

	private _isMovePossible(move: Vector2): boolean {
		let possible = true;
		this._blocks.forEach(b => {
			const targetPosition = b.position.clone().add(move).add(this._position);
			if (targetPosition.x < 0 || targetPosition.y < 0 || targetPosition.x >= this._field.width || targetPosition.y >= this._field.height || this._field.state[targetPosition.x][targetPosition.y]) {				
				possible = false;
			}
		})
		return possible;
	}
	//endregion
}
