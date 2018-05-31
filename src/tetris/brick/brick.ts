/// <reference path="../../../definitions/phaser.d.ts"/>


import "phaser";
import Vector2 = Phaser.Math.Vector2;
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

	public moveLeft(): void {
		this.position.x--;		
	}

	public moveRight(): void {
		this.position.x++;				
	}

	public dropOne(): void {
		this.position.y++;
	}
	
	public dropToFloor(): void {
		// TODO: Implement
		// Drop to active brick at the current x position
		// and spawn a new brick				this.activeBrick.position.y++;
	}

	public rotate(): void{
		// TODO: Implement
		// standard one-way rotation (clockwise)
	}

	public moveDown(): void {
		this.position.y++;
	}
	//endregion

	//region public methods
	public addBlock(sprite: Phaser.GameObjects.Sprite, relativePosition: Vector2): void {
		const block = new Block(sprite, relativePosition);
		this._blocks = this.blocks.concat(block);
	}

	public isStuck(): boolean {
		// TODO: implement me
		return false;
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
	//endregion

	//region private methods
	//endregion
}
