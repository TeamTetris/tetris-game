import Ethnicity from "tetris/profiler/profileValues/ethnicity";

export default class FppFaceAnalysis {

	//region public members
	public get age(): number {
		return this._age;
	}

	public get ethnicity(): Ethnicity {
		return this._ethnicity;
	}

	public get gender(): string {
		return this._gender;
	}

	public get beauty(): number {
		return this._beauty;
	}

	public get skinAcne(): number {
		return this._skinAcne;
	}

	public get skinHealth(): number {
		return this._skinHealth;
	}

	public get glasses(): boolean {
		return this._glasses;
	}
	//endregion

	//region public methods
	//endregion

	//region constructor
	public static newFromResponse(fppResponse: object): FppFaceAnalysis {
		try {
			return new FppFaceAnalysis(fppResponse);
		} catch (error) {
			return null;
		}
	}

	private constructor(fppResponse: object) {
		const attributes: object = fppResponse["faces"][0]["attributes"];

		this._age = attributes["age"].value;
		this._ethnicity = this._parseEthnicity(attributes["ethnicity"].value);
		this._gender = attributes["gender"].value.toLowerCase();
		this._beauty = attributes["beauty"][this._gender + "_score"];
		this._skinAcne = attributes["skinstatus"]["acne"];
		this._skinHealth = attributes["skinstatus"]["health"];
		this._glasses = attributes["glass"].value != "None";
	}
	//endregion

	//region private members
	private readonly _age: number;
	private readonly _ethnicity: Ethnicity;
	private readonly _gender: string;
	private readonly _beauty: number;
	private readonly _skinAcne: number;
	private readonly _skinHealth: number;
	private readonly _glasses: boolean;
	//endregion

	//region private methods
	private _parseEthnicity(value: string): Ethnicity {
		const key = Object.keys(Ethnicity).find(key => key.toUpperCase() === value.toUpperCase());
		return key? Ethnicity[key] : Ethnicity.UNDETECTED;
	}
	//endregion
}
