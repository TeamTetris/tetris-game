import MatchPlayer from "tetris/interfaces/MatchPlayer";

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

	public get id(): number {
		return this._id;
	}

	public get players(): MatchPlayer[] {
		return this._players;
	}

	public get joinUntil(): number {
		return this._joinUntil;
	}

	public get nextElimination(): number {
		return this._nextElimination;
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
	public constructor(serverResponse: object) {
		this._players = serverResponse['players'];
		this._id = serverResponse['id'];
		this._joinUntil = serverResponse['joinUntil'] ? Date.parse(serverResponse['joinUntil']) : 0;
		this._nextElimination = serverResponse['nextElimination'] ? Date.parse(serverResponse['nextElimination']) : 0;
		this._startTime = serverResponse['startTime'] ? Date.parse(serverResponse['startTime']) : 0;
	}
	//endregion

	//region private members
	private readonly _id: number;
	private readonly _players: MatchPlayer[];
	private readonly _joinUntil: number;
	private readonly _nextElimination: number;
	private readonly _startTime: number;
	private _endTime: number;
	private _score: number;
	//endregion

	//region private methods
	//endregion
}