
export default class BrickChances {

	//region public members
	public get chances(): number[] {
		return this._chances;
	}
	//endregion

	//region public methods
	public setChanceI(chance: number): BrickChances {
		this._chances[this._indexI] = chance;
		return this;
	}

	public setChanceO(chance: number): BrickChances {
		this._chances[this._indexO] = chance;
		return this;
	}

	public setChanceL(chance: number): BrickChances {
		this._chances[this._indexL] = chance;
		return this;
	}

	public setChanceJ(chance: number): BrickChances {
		this._chances[this._indexJ] = chance;
		return this;
	}

	public setChanceT(chance: number): BrickChances {
		this._chances[this._indexT] = chance;
		return this;
	}

	public setChanceS(chance: number): BrickChances {
		this._chances[this._indexS] = chance;
		return this;
	}

	public setChanceZ(chance: number): BrickChances {
		this._chances[this._indexZ] = chance;
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
		this._chances = [];
	}
	//endregion

	//region private members
	private readonly _indexI: number = 0;
	private readonly _indexO: number = 1;
	private readonly _indexL: number = 2;
	private readonly _indexJ: number = 3;
	private readonly _indexT: number = 4;
	private readonly _indexS: number = 5;
	private readonly _indexZ: number = 6;

	private _chances: number[];
	//endregion

	//region private methods
	//endregion
}
