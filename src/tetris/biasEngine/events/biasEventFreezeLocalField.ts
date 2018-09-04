import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventType from "tetris/biasEngine/biasEventType";

export default class BiasEventFreezeLocalField extends BiasEvent {

	//region public members
	public get minDurationInMs(): number {
		return 250;
	}

	public get maxDurationInMs(): number {
		return 750;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor() {
		super(BiasEventType.FreezeLocalField);
		this._setDetectionLevelIncreasePerSecond(0.5);
		this._setDetectionLevelDecreasePerSecond(0.025);
		this._setNegativeSpawnBiasThreshold(1);
	}
	//endregion

	//region private members
	//endregion

	//region private methods
	//endregion

	//region protected members
	//endregion

	//region protected methods
	protected _createNewInstance(): BiasEventFreezeLocalField {
		return new BiasEventFreezeLocalField();
	}
	//endregion
}
