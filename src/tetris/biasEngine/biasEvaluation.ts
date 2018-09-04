import BiasEvent from "tetris/biasEngine/biasEvent";

export default class BiasEvaluation {

	//region public members
	public get biasEvents(): BiasEvent[] {
		return this._biasEvents;
	}
	//endregion

	//region public methods
	public add(biasEvent: BiasEvent): void {
		this._biasEvents.push(biasEvent);
	}
	//endregion

	//region constructor
	public constructor() {
		this._biasEvents = [];
	}
	//endregion

	//region private members
	private readonly _biasEvents: BiasEvent[];
	//endregion

	//region private methods
	//endregion
}