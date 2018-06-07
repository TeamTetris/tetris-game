import Vector2 = Phaser.Math.Vector2;
import BrickChances from "tetris/brick/brickChances"
import Field from "tetris/field/field"

export default class BrickBias {

	//region public members
	public get chances(): BrickChances {
		return this._chances;
	}

	public set chances(chances: BrickChances) {
		this._chances = chances;
	}

	public get position(): Vector2 {
		return this._position;
	}

	public set position(position: Vector2) {
		this._position = position;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public static newDefault(field: Field): BrickBias {
		const bias = new BrickBias();
		bias.chances = BrickChances.newEqualChances();
		bias.position = new Vector2(field.width / 2, 0);

		return bias;
	}
	//endregion

	//region private members
	private _chances: BrickChances;
	private _position: Vector2;
	//endregion

	//region private methods
	//endregion
}
