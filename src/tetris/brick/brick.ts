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
		// TODO: Implement
	}

	public moveRight(): void {
		// TODO: Implement
	}

	public drop(): void {
		// TODO: Implement
		// Drop to active brick at the current x position
		// and spawn a new brick
	}

	public rotate(): void{
		// TODO: Implement
		// standard one-way rotation (clockwise)
	}

	public moveDown(): void {

	}
	//endregion

	//region public methods
	public addBlock(sprite: Phaser.GameObjects.Sprite, relativePosition: Vector2): void {
		const block = new Block(sprite, this.position.add(relativePosition));
		this._blocks = this.blocks.concat(block);
	}

	public isStuck(): boolean {
		// TODO: implement me
		return false;
	}

	public update(time: number, delta: number): void {
		this._blocks.forEach(b => b.update(this._position));
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
