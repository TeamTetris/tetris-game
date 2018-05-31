
export default class BrickChances {

	//region public members
	public get probabilities(): number[] {
		return this._probabilities;
	}
	//endregion

	//region public methods
	public setChanceI(chance: number): BrickChances {
		this._probabilities[this._brickIndices["I"]] = chance;
		return this;
	}

	public setChanceO(chance: number): BrickChances {
		this._probabilities[this._brickIndices["O"]] = chance;
		return this;
	}

	public setChanceL(chance: number): BrickChances {
		this._probabilities[this._brickIndices["L"]] = chance;
		return this;
	}

	public setChanceJ(chance: number): BrickChances {
		this._probabilities[this._brickIndices["J"]] = chance;
		return this;
	}

	public setChanceT(chance: number): BrickChances {
		this._probabilities[this._brickIndices["T"]] = chance;
		return this;
	}

	public setChanceS(chance: number): BrickChances {
		this._probabilities[this._brickIndices["S"]] = chance;
		return this;
	}

	public setChanceZ(chance: number): BrickChances {
		this._probabilities[this._brickIndices["Z"]] = chance;
		return this;
	}
	//endregion

	//region constructor
	public static newEqualChances(): BrickChances {
		const chances = new BrickChances();
		chances._probabilities = [1, 1, 1, 1, 1, 1, 1];

		return chances;
	}

	public static newNoChances(): BrickChances {
		const chances = new BrickChances();
		chances._probabilities = [0, 0, 0, 0, 0, 0, 0];

		return chances;
	}

	private constructor() {
		this._brickIndices = new Map<string, number>()
			.set("I", 0)
			.set("O", 1)
			.set("L", 2)
			.set("J", 3)
			.set("T", 4)
			.set("S", 5)
			.set("Z", 6);

		this._probabilities = [];
	}
	//endregion

	//region private members
	private readonly _brickIndices: Map<string, number>;
	private _probabilities: number[];
	//endregion

	//region private methods
	//endregion
}
