import ProfileDataUpdateStrategy from "tetris/profiler/updateStrategy/profileDataUpdateStrategy";
import ProfileData from "tetris/profiler/profileData";
import BaseProfileData from "tetris/profiler/baseProfileData";
import Utility from "tetris/utility";

export default class NumberDataUpdateStrategy extends ProfileDataUpdateStrategy<number> {

	//region public members
	public get latestValueWeight(): number {
		return this._latestValueWeight;
	}

	public set latestValueWeight(weight: number) {
		this._latestValueWeight = Utility.limitValueBetweenMinAndMax(Math.abs(weight), 0.0, 1.0);
	}
	//endregion

	//region public methods
	public accumulate(profileData: ProfileData<number>, latestValue: number): number {
		// check, whether this is the first value ever
		if (!profileData.isDefined) {
			profileData.confidence = 0.5 * BaseProfileData.CONFIDENCE_RANGE + BaseProfileData.MIN_CONFIDENCE;
			return latestValue;
		}

		const newValue = latestValue * this.latestValueWeight + profileData.value * (1 - this.latestValueWeight);
		let valueDifference = 0;

		if (profileData.value == 0) {
			// don't divide by zero!
			valueDifference = newValue;
		} else {
			valueDifference = (newValue - profileData.value) / profileData.value;
		}

		// gain at least a little confidence to avoid measuring data too fast again
		// the closer our value difference to 0 is, the more confidence boost we get
		profileData.confidence += Math.max(
			0.1 * BaseProfileData.CONFIDENCE_RANGE,
			(1 - Math.abs(valueDifference)) * BaseProfileData.CONFIDENCE_RANGE
		);
		return newValue;
	}
	//endregion

	//region constructor
	public constructor(latestValueWeight: number = 0.15) {
		super();
		this.latestValueWeight = latestValueWeight;
	}
	//endregion

	//region private members
	private _latestValueWeight: number;
	//endregion

	//region private methods
	//endregion
}
