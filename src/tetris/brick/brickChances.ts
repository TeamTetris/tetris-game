
export default class BrickChances {

	//region public members
	public get chances(): number[] {
		return this._chances;
	}
	//endregion

	//region public methods
	public setChanceI(chance: number): BrickChances {
		this._chances[this._chanceBrickMapping.I] = chance;
		return this;
	}

	public setChanceO(chance: number): BrickChances {
		this._chances[this._chanceBrickMapping.O] = chance;
		return this;
	}

	public setChanceL(chance: number): BrickChances {
		this._chances[this._chanceBrickMapping.L] = chance;
		return this;
	}

	public setChanceJ(chance: number): BrickChances {
		this._chances[this._chanceBrickMapping.J] = chance;
		return this;
	}

	public setChanceT(chance: number): BrickChances {
		this._chances[this._chanceBrickMapping.T] = chance;
		return this;
	}

	public setChanceS(chance: number): BrickChances {
		this._chances[this._chanceBrickMapping.S] = chance;
		return this;
	}

	public setChanceZ(chance: number): BrickChances {
		this._chances[this._chanceBrickMapping.Z] = chance;
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
		this._chanceBrickMapping = {
			I: 0,
			O: 1,
			L: 2,
			J: 3,
			T: 4,
			S: 5,
			Z: 6
		};

		this._chances = [];
	}
	//endregion

	//region private members
	private readonly _chanceBrickMapping: object;
	private _chances: number[];
	//endregion

	//region private methods
	//endregion
}
