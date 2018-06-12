import BaseProfileData from "tetris/profiler/baseProfileData";

export default class ProfileDataConfidenceStrategy {

	//region public members
	//endregion

	//region public methods
	public update(profileData: BaseProfileData, delta: number): void {
		this._deltaSinceLatestConfidenceUpdate =+ delta;
		if (this._deltaSinceLatestConfidenceUpdate < this._deltaUntilConfidenceUpdate) {
			return;
		}
		profileData.confidence = Math.max(
			BaseProfileData.MIN_CONFIDENCE,
			profileData.confidence - this._periodicDecrementValue
		);
		this._deltaSinceLatestConfidenceUpdate = 0;
	}
	//endregion

	//region constructor
	constructor(periodicDecrementValue: number = 0.01, deltaUntilConfidenceUpdate: number = 30000) {
		this._periodicDecrementValue = periodicDecrementValue;
		this._deltaUntilConfidenceUpdate = deltaUntilConfidenceUpdate;
	}
	//endregion

	//region private members
	private readonly _periodicDecrementValue: number;
	private readonly _deltaUntilConfidenceUpdate: number;
	private _deltaSinceLatestConfidenceUpdate: number = 0;
	//endregion

	//region private methods
	//endregion
}