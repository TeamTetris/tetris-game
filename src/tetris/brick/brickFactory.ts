/// <reference path="../../../definitions/phaser.d.ts"/>


import Vector2 = Phaser.Math.Vector2;
import Brick from "tetris/brick/brick";
import BiasEngine from "tetris/biasEngine/biasEngine";
import Field from "tetris/field/field";
import BrickChances from "tetris/brick/brickChances";
import config from "tetris/config";
import BrickType from "tetris/brick/brickType";
import SkinStorage from "tetris/brick/skinStorage";

interface BrickCreationFunction {
	(blockAssetId: string, position: Vector2, field: Field): Brick;
}

export default class BrickFactory {

	//region public members
	//endregion

	//region public methods
	public newBrick(field: Field): Brick {
		const bias = this._biasEngine.newBrickBias(field);
		return this._newBrick(bias.position, bias.chances, field);
	}

	public newCustomBrick(brickType: BrickType, position: Vector2): Brick {
		const brick = this._brickCreationFunctions[brickType]("colorful_01", position, null);
		brick.custom = true;
		return brick;
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, biasEngine: BiasEngine, skinStorage: SkinStorage) {
		this._biasEngine = biasEngine;
		this._scene = scene;
		this._skinStorage = skinStorage;

		this._brickCreationFunctions = [
			this._newI.bind(this),
			this._newO.bind(this),
			this._newL.bind(this),
			this._newJ.bind(this),
			this._newT.bind(this),
			this._newS.bind(this),
			this._newZ.bind(this)
		];
	}
	//endregion

	//region private members
	private _biasEngine: BiasEngine;
	private _scene: Phaser.Scene;
	private _skinStorage: SkinStorage;
	private readonly _brickCreationFunctions: BrickCreationFunction[];
	//endregion

	//region private methods
	private _newBrick(position: Vector2, chances: BrickChances, field: Field): Brick {
		if (chances.chances.length != this._brickCreationFunctions.length) {
			throw new Error("cannot generate brick: #chances did not match #brick.");
		}

		const total = chances.chances.reduce((sum, chance) => sum + Math.abs(chance), 0);

		if (total <= 0) {
			throw new Error("cannot generate brick: total chances <= 0.");
		}

		let random = Math.random();
		for (let i = 0; i < chances.chances.length; i++) {
			const normalized_chance = Math.abs(chances.chances[i]) / total;

			if (normalized_chance < random) {
				random -= normalized_chance;
				continue;
			}
			
			return this._brickCreationFunctions[i](this._skinStorage.getEquippedSkin(i).frameName, position, field);
		}

		throw new Error("cannot generate brick: no chance was met (random = " + random + ").");
	}


	private _createSprite(blockAssetId: string): Phaser.GameObjects.Sprite {
		return this._scene.add.sprite(0, 0, config.atlasKeys.blockSpriteAtlasKey, blockAssetId);
	}

	private _newI(blockAssetId: string, position: Vector2, field: Field): Brick {
		const brick = new Brick(position, field);

		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, -2), new Vector2(-1, -1) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, -1) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 0), new Vector2(1, -1) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 1), new Vector2(2, -1) ]);

		return brick;
	}

	private _newO(blockAssetId: string, position: Vector2, field: Field): Brick {
		const brick = new Brick(position, field);

		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(1, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 1) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(1, 1) ]);

		return brick;
	}

	private _newL(blockAssetId: string, position: Vector2, field: Field): Brick {
		const brick = new Brick(position, field);

		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, -1), new Vector2(1, 0), new Vector2(0, 1), new Vector2(-1, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 1), new Vector2(-1, 0), new Vector2(0, -1), new Vector2(1, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(1, 1), new Vector2(-1, 1), new Vector2(-1, -1), new Vector2(1, -1) ]);

		return brick;
	}

	private _newJ(blockAssetId: string, position: Vector2, field: Field): Brick {
		const brick = new Brick(position, field);

		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, -1), new Vector2(1, 0), new Vector2(0, 1), new Vector2(-1, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 1), new Vector2(-1, 0), new Vector2(0, -1), new Vector2(1, 0)  ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(-1, 1), new Vector2(-1, -1), new Vector2(1, -1), new Vector2(1, 1) ]);

		return brick;
	}

	private _newT(blockAssetId: string, position: Vector2, field: Field): Brick {
		const brick = new Brick(position, field);

		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 0), new Vector2(1, -1), new Vector2(2, 0), new Vector2(1, 1) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(1, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(2, 0), new Vector2(1, 1), new Vector2(0, 0), new Vector2(1, -1) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(1, 1), new Vector2(0, 0), new Vector2(1, -1), new Vector2(2, 0) ]);

		return brick;
	}

	private _newZ(blockAssetId: string, position: Vector2, field: Field): Brick {
		const brick = new Brick(position, field);

		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 0), new Vector2(2, -1) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(1, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(1, 1) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(2, 1), new Vector2(2, 0) ]);

		return brick;
	}

	private _newS(blockAssetId: string, position: Vector2, field: Field): Brick {
		const brick = new Brick(position, field);

		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(1, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(2, 0) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(0, 1), new Vector2(1, -1) ]);
		brick.addBlock(this._createSprite(blockAssetId), [ new Vector2(1, 1), new Vector2(2, 1) ]);

		return brick;
	}
	//endregion
}
