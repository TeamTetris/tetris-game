import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventType from "tetris/biasEngine/biasEventType";

export default class BiasEventDisableInput extends BiasEvent {

	//region public members
	public get maxDuration(): number {
		return 2.5;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor() {
		super(BiasEventType.DisableInput);
		this._setDetectionLevelIncreasePerSecond(0.1);
		this._setDetectionLevelDecreasePerSecond(0.025);
		this._setNegativeSpawnBiasThreshold(0.75);
	}
	//endregion

	//region private members
	//endregion

	//region private methods
	//endregion

	//region protected members
	//endregion

	//region protected methods
	protected _createNewInstance(): BiasEventDisableInput {
		return new BiasEventDisableInput();
	}
	//endregion
}
