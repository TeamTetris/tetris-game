
export default class BrickChances {

	//region public members
	public get chances(): number[] {
		return this._chances;
	}
	//endregion

	//region public methods
	public setChanceI(chance: number): BrickChances {
		this._chances[this._brickIndices.get("I")] = chance;
		return this;
	}

	public setChanceO(chance: number): BrickChances {
		this._chances[this._brickIndices.get("O")] = chance;
		return this;
	}

	public setChanceL(chance: number): BrickChances {
		this._chances[this._brickIndices.get("L")] = chance;
		return this;
	}

	public setChanceJ(chance: number): BrickChances {
		this._chances[this._brickIndices.get("J")] = chance;
		return this;
	}

	public setChanceT(chance: number): BrickChances {
		this._chances[this._brickIndices.get("T")] = chance;
		return this;
	}

	public setChanceS(chance: number): BrickChances {
		this._chances[this._brickIndices.get("S")] = chance;
		return this;
	}

	public setChanceZ(chance: number): BrickChances {
		this._chances[this._brickIndices.get("Z")] = chance;
		return this;
	}
	//endregion

	//region constructor
	public static newEqualChances(): BrickChances {
		const chances = new BrickChances();
		chances._chances = [1, 1, 1, 1, 1, 1, 1];

		return chances;
	}

	public static newNoChances(): BrickChances {
		const chances = new BrickChances();
		chances._chances = [0, 0, 0, 0, 0, 0, 0];

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

		this._chances = [];
	}
	//endregion

	//region private members
	private readonly _brickIndices: Map<string, number>;
	private _chances: number[];
	//endregion

	//region private methods
	//endregion
}
