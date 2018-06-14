import ProfileData from "tetris/profiler/profileData";
import BaseProfileData from "tetris/profiler/baseProfileData";

export default class ProfileDataUpdateStrategy<ValueType> {

	//region public members
	//endregion

	//region public methods
	public accumulate(profileData: ProfileData<ValueType>, latestValue: ValueType): ValueType {
		// gain a little confidence to avoid measuring data too soon
		profileData.confidence += 0.4 * BaseProfileData.CONFIDENCE_RANGE;
		return latestValue;
	}
	//endregion

	//region constructor
	//endregion

	//region private members
	//endregion

	//region private methods
	//endregion
}
