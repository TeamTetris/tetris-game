import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventType from "tetris/biasEngine/biasEventType";

export default class BiasEventDuplicateInput extends BiasEvent {

	//region public members
	public get chance(): number {
		return this._chance;
	}

	public set chance(chance: number) {
		this._chance = Math.min(1, Math.abs(chance));
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(startTime: number, endTime: number, duplicateChance: number = 1.0) {
		super(BiasEventType.DuplicateInput, startTime, endTime);
		this.chance = duplicateChance;
	}
	//endregion

	//region private members
	private _chance: number;
	//endregion

	//region private methods
	//endregion
}
