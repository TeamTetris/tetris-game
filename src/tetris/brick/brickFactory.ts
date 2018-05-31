/// <reference path="../../../definitions/phaser.d.ts"/>


import Vector2 = Phaser.Math.Vector2;
import Brick from "tetris/brick/brick";
import BiasEngine from "tetris/biasEngine/biasEngine";
import Field from "tetris/field/field";

interface BrickCreationFunction {
	(blockAssetId: string, position: Vector2): Brick;
}

export default class BrickFactory {

	//region public members
	//endregion

	//region public methods
	public newBrick(field: Field): Brick {
		const blockAssetId = this._selectBlockAssetId();
		const bias = this._biasEngine.newBrickBias(field);
		return this._newBrick(blockAssetId, bias.position, bias.chances.probabilities);
	}
	//endregion

	//region constructor
	public constructor(biasEngine: BiasEngine) {
		this._biasEngine = biasEngine;

		this._brickCreationFunctions = [
			this._newI,
			this._newO,
			this._newL,
			this._newJ,
			this._newT,
			this._newS,
			this._newZ
		];

		this._blockAssetIds = [
			/*
			TODO: add block asset ids
			 */
		]
	}
	//endregion

	//region private members
	private _biasEngine: BiasEngine;
	private readonly _brickCreationFunctions: BrickCreationFunction[];
	private readonly _blockAssetIds: string[];
	//endregion

	//region private methods
	private _selectBlockAssetId(): string {
		const index = Math.floor(Math.random() * Math.floor(this._blockAssetIds.length));
		return this._blockAssetIds[index];
	}

	private _newBrick(blockAssetId: string, position: Vector2, chances: number[]): Brick {
		if (chances.length != this._brickCreationFunctions.length) {
			throw new Error("cannot generate brick: #probabilities did not match #brick.");
		}

		const total = chances.reduce((sum, chance) => sum + Math.abs(chance), 0);

		let random = Math.random();
		for (let i = 0; i < chances.length; i++) {
			const normalized_chance = Math.abs(chances[i]) / total;

			if (normalized_chance < random) {
				random -= normalized_chance;
				continue;
			}

			return this._brickCreationFunctions[i](blockAssetId, position);
		}

		throw new Error("cannot generate brick: no chance was met (random = " + random + ").");
	}

	private _newI(blockAssetId: string, position: Vector2): Brick {
		const brick = new Brick(blockAssetId, position);

		brick.addBlock(new Vector2(0, 0));
		brick.addBlock(new Vector2(0, 1));
		brick.addBlock(new Vector2(0, 2));
		brick.addBlock(new Vector2(0, 3));


		return brick;
	}

	private _newO(blockAssetId: string, position: Vector2): Brick {
		const brick = new Brick(blockAssetId, position);

		brick.addBlock(new Vector2(0, 0));
		brick.addBlock(new Vector2(1, 0));
		brick.addBlock(new Vector2(0, 1));
		brick.addBlock(new Vector2(1, 1));

		return brick;
	}

	private _newL(blockAssetId: string, position: Vector2): Brick {
		const brick = new Brick(blockAssetId, position);

		brick.addBlock(new Vector2(0, 0));
		brick.addBlock(new Vector2(0, 1));
		brick.addBlock(new Vector2(0, 2));
		brick.addBlock(new Vector2(1, 2));

		return brick;
	}

	private _newJ(blockAssetId: string, position: Vector2): Brick {
		const brick = new Brick(blockAssetId, position);

		brick.addBlock(new Vector2(1, 0));
		brick.addBlock(new Vector2(1, 1));
		brick.addBlock(new Vector2(1, 2));
		brick.addBlock(new Vector2(0, 2));

		return brick;
	}

	private _newT(blockAssetId: string, position: Vector2): Brick {
		const brick = new Brick(blockAssetId, position);

		brick.addBlock(new Vector2(0, 0));
		brick.addBlock(new Vector2(1, 0));
		brick.addBlock(new Vector2(2, 0));
		brick.addBlock(new Vector2(1, 1));

		return brick;
	}

	private _newZ(blockAssetId: string, position: Vector2): Brick {
		const brick = new Brick(blockAssetId, position);

		brick.addBlock(new Vector2(0, 0));
		brick.addBlock(new Vector2(1, 0));
		brick.addBlock(new Vector2(1, 1));
		brick.addBlock(new Vector2(2, 1));

		return brick;
	}

	private _newS(blockAssetId: string, position: Vector2): Brick {
		const brick = new Brick(blockAssetId, position);

		brick.addBlock(new Vector2(1, 0));
		brick.addBlock(new Vector2(2, 0));
		brick.addBlock(new Vector2(0, 1));
		brick.addBlock(new Vector2(1, 1));

		return brick;
	}
	//endregion
}
