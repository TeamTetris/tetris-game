import {dataSource} from "tetris/biasEngine/datasources/passport_value_dataset";

export default class PassportValue {

	//region public members
	public get minScore(): number {
		return this._minScore;
	}

	public get maxScore(): number {
		return this._maxScore;
	}
	//endregion

	//region public methods
	public getForCountry(country: string): number {
		const countryDataSet = dataSource.find(dataSet => dataSet.country === country);
		return countryDataSet ? countryDataSet.score : 0;
	}
	//endregion

	//region constructor
	private static _instance: PassportValue;

	public static get instance(): PassportValue {
		if (!this._instance) {
			this._instance = new PassportValue();
		}
		return this._instance;
	}

	public constructor() {
		dataSource.forEach(dataSet => {
			this._minScore = Math.min(this._minScore, dataSet.score);
			this._maxScore = Math.max(this._maxScore, dataSet.score);
		});
	}
	//endregion

	//region private members
	private _minScore: number = Number.MAX_VALUE;
	private _maxScore: number = Number.MIN_VALUE;
	//endregion

	//region private methods
	//endregion
}