export default class Utility {
	//region public methods
	public static limitValueBetweenMinAndMax(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	public static haveSameSign(value1: number, value2: number): boolean {
		return value1 * value2 >= 0;
	}

	public static displayAsPercent(value: number): string {
		return (value * 100.0).toFixed(4) + "%";
	}
	//endregion

	//region public members
	//endregion

	//region constructor
	//endregion

	//region private members
	//endregion

	//region private methods
	//endregion
}