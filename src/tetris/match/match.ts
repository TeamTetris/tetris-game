export default class Match {

	//region public members
	public get startTime(): number {
		return this._startTime;
	}

	public get endTime(): number {
		return this._endTime;
	}

	public get score(): number {
		return this._score;
	}

	public get duration(): number {
		return this._endTime - this._startTime;
	}
	//endregion

	//region public methods
	public end(score: number): void {
		this._endTime = Date.now();
		this._score = score;
	}
	//endregion

	//region constructor
	public constructor() {
		this._startTime = Date.now();
	}
	//endregion

	//region private members
	private readonly _startTime: number;
	private _endTime: number;
	private _score: number;
	//endregion

	//region private methods
	//endregion
}