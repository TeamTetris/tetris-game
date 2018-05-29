import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventType from "tetris/biasEngine/biasEventType";

export default class BiasEventDuplicateInput extends BiasEvent {

	//region public members
	public get duplicateChance(): number {
		return this._duplicateChance;
	}

	public set duplicateChance(chance: number) {
		this._duplicateChance = Math.min(1, Math.abs(chance));
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(startTime: number, endTime: number, duplicateChance: number = 1.0) {
		super(BiasEventType.DuplicateInput, startTime, endTime);
		this.duplicateChance = duplicateChance;
	}
	//endregion

	//region private members
	private _duplicateChance: number;
	//endregion

	//region private methods
	//endregion
}
