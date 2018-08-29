import Vector2 = Phaser.Math.Vector2;
import BrickChances from "tetris/brick/brickChances"
import Field from "tetris/field/field"
import BiasEngine from "tetris/biasEngine/biasEngine";

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
	public static newFromTierList(field: Field, biasValue: number): BrickBias {
		const brickBias = BrickBias.newDefault(field);
		brickBias.chances = BrickChances.newNoChances();
		
		const distanceBetween = (a, b) => Math.pow(Math.abs(a - b), 2);
		
		brickBias.chances.setChanceI(distanceBetween(biasValue, BiasEngine.MAX_NEGATIVE_BIAS_VALUE));
		brickBias.chances.setChanceO(distanceBetween(biasValue, BiasEngine.MAX_NEGATIVE_BIAS_VALUE));
		brickBias.chances.setChanceL(distanceBetween(biasValue, BiasEngine.NEUTRAL_BIAS_VALUE));
		brickBias.chances.setChanceJ(distanceBetween(biasValue, BiasEngine.NEUTRAL_BIAS_VALUE));
		brickBias.chances.setChanceT(distanceBetween(biasValue, BiasEngine.NEUTRAL_BIAS_VALUE));
		brickBias.chances.setChanceS(distanceBetween(biasValue, BiasEngine.MAX_POSITIVE_BIAS_VALUE));
		brickBias.chances.setChanceZ(distanceBetween(biasValue, BiasEngine.MAX_POSITIVE_BIAS_VALUE));

		return brickBias;
	}
	
	public static newDefault(field: Field): BrickBias {
		const bias = new BrickBias();
		bias.chances = BrickChances.newEqualChances();
		bias.position = new Vector2(field.width / 2 - 1, -2);

		return bias;
	}

	private constructor() {
		this._chances = BrickChances.newEqualChances();
		this._position = new Vector2(0, 0);
	}
	//endregion

	//region private members
	private _chances: BrickChances;
	private _position: Vector2;
	//endregion

	//region private methods
	//endregion
}
