import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventType from "tetris/biasEngine/biasEventType";

export default class BiasEventDuplicateInput extends BiasEvent {

	//region public members
	public get chance(): number {
		return this._chance;
	}

	public set chance(chance: number) {
		this._chance = Math.min(1.0, Math.max(0.0, chance));
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor() {
		super(BiasEventType.DuplicateInput);
	}
	//endregion

	//region private members
	private _chance: number = 1.0;
	//endregion

	//region private methods
	//endregion

	//region protected members
	//endregion

	//region protected methods
	protected _clone(): BiasEvent {
		let event = super._clone() as BiasEventDuplicateInput;
		event._chance = this.chance;

		return event;
	}

	protected _createNewInstance(): BiasEventDuplicateInput {
		return new BiasEventDuplicateInput();
	}
	//endregion
}
