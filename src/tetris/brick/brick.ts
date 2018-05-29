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
	//endregion

	//region public methods
	public addBlock(relativePosition: Vector2): void {
		const block = new Block(this._blockAssetId, this.position.add(relativePosition));
		this._blocks = this.blocks.concat(block);
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
