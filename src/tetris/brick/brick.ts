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
	}

	public rotate(): void{
		// TODO: Implement
	}

	public moveDown(): void {

	}
	//endregion

	//region public methods
	public addBlock(relativePosition: Vector2): void {
		const block = new Block(this._blockAssetId, this.position.add(relativePosition));
		this._blocks = this.blocks.concat(block);
	}

	public isStuck(): boolean {
		// TODO: implement me
		return true;
	}

	public update(time: number, delta: number): void {
		// TODO: implement me
	}
	//endregion

	//region constructor
	public constructor(blockAssetId: string, position: Vector2) {
		this._blockAssetId = blockAssetId;
		this.position = position;
		this._blocks = [];
	}
	//endregion

	//region private members
	private _position: Vector2;
	private _blocks: Block[];
	private readonly _blockAssetId: string;
	//endregion

	//region private methods
	//endregion
}
