import BaseProfileData from "tetris/profiler/baseProfileData";

export default class ProfileDataConfidenceStrategy {

	//region public members
	//endregion

	//region public methods
	public update(profileData: BaseProfileData, delta: number): void {
		profileData.confidence -= this._decreasePerSecond * (delta / 1000) * BaseProfileData.CONFIDENCE_RANGE;
	}
	//endregion

	//region constructor
	private constructor(periodicDecrementValuePerSecond: number) {
		this._decreasePerSecond = periodicDecrementValuePerSecond;
	}

	public static slow(): ProfileDataConfidenceStrategy {
		return ProfileDataConfidenceStrategy._slowDecrease;
	}

	public static default(): ProfileDataConfidenceStrategy {
		return ProfileDataConfidenceStrategy._defaultDecrease;
	}

	public static fast(): ProfileDataConfidenceStrategy {
		return ProfileDataConfidenceStrategy._fastDecrease;
	}

	public static ultraFast(): ProfileDataConfidenceStrategy {
		return ProfileDataConfidenceStrategy._ultraFastDecrease;
	}
	//endregion

	//region private members
	private static readonly _slowDecrease: ProfileDataConfidenceStrategy = new ProfileDataConfidenceStrategy(0.01 / 30);
	private static readonly _defaultDecrease: ProfileDataConfidenceStrategy = new ProfileDataConfidenceStrategy(0.01 / 15);
	private static readonly _fastDecrease: ProfileDataConfidenceStrategy = new ProfileDataConfidenceStrategy(0.01 / 5);
	private static readonly _ultraFastDecrease: ProfileDataConfidenceStrategy = new ProfileDataConfidenceStrategy(0.01 / 0.5);
	private readonly _decreasePerSecond: number;
	//endregion

	//region private methods
	//endregion
}