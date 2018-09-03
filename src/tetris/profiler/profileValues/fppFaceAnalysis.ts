import Ethnicity from "tetris/profiler/profileValues/ethnicity";
import Gender from "tetris/profiler/profileValues/gender";
import Printable from "tetris/profiler/profileValues/printable";

export default class FppFaceAnalysis implements Printable {

	//region public members
	public get age(): number {
		return this._age;
	}

	public get ethnicity(): Ethnicity {
		return this._ethnicity;
	}

	public get gender(): Gender {
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

	public get image(): string {
		return this._image;
	}
	//endregion

	//region public methods
	public printHTML(): string {
		return 	"<strong>Age: </strong> " + this.age + " </br>" +
				"<strong>Beauty: </strong> " + (this.beauty * 100).toFixed(2) + "%</br>" +
				"<strong>Ethnicity: </strong> " + this.ethnicity + " </br>" +
				"<strong>Gender: </strong> " + this.gender + " </br>" +
				"<strong>Glasses: </strong> " + this.glasses + " </br>" +
				"<strong>Acne: </strong> " + (this.skinAcne * 100).toFixed(2) + "%</br>" +
				"<strong>Skin health: </strong> " + (this.skinHealth * 100).toFixed(2) + "%</br>" +
				"<img height='200' src='data:image/png;base64, " + this.image + "' />";
	}
	//endregion

	//region constructor
	public static newFromResponse(fppResponse: object, image?: string): FppFaceAnalysis {
		try {
			return new FppFaceAnalysis(fppResponse, image);
		} catch (error) {
			return null;
		}
	}

	private constructor(fppResponse: object, image?: string) {
		const attributes: object = fppResponse["faces"][0]["attributes"];

		this._age = attributes["age"].value;
		this._ethnicity = this._parseEthnicity(attributes["ethnicity"].value);
		this._gender = this._parseGender(attributes["gender"].value);
		this._beauty = attributes["beauty"][this._gender.toLowerCase() + "_score"] / FppFaceAnalysis.MAX_BEAUTY_SCORE;
		this._skinAcne = attributes["skinstatus"]["acne"] / FppFaceAnalysis.MAX_ACNE_SCORE;
		this._skinHealth = attributes["skinstatus"]["health"] / FppFaceAnalysis.MAX_SKIN_HEALTH_SCORE;
		this._glasses = attributes["glass"].value != "None";
		this._image = image;
	}
	//endregion

	//region private members
	private readonly _age: number;
	private readonly _ethnicity: Ethnicity;
	private readonly _gender: Gender;
	private readonly _beauty: number;
	private readonly _skinAcne: number;
	private readonly _skinHealth: number;
	private readonly _glasses: boolean;
	private readonly _image: string;

	private static get MAX_BEAUTY_SCORE(): number {
		return 100.0;
	}

	private static get MAX_ACNE_SCORE(): number {
		return 100.0;
	}

	private static get MAX_SKIN_HEALTH_SCORE(): number {
		return 100.0;
	}
	//endregion

	//region private methods
	private _parseEthnicity(value: string): Ethnicity {
		const key = Object.keys(Ethnicity).find(key => key.toUpperCase() === value.toUpperCase());
		return key? Ethnicity[key] : Ethnicity.Undetected;
	}

	private _parseGender(value: string): Gender {
		const key = Object.keys(Gender).find(key => key.toUpperCase() === value.toUpperCase());
		return key? Gender[key] : Gender.Undetected;
	}
	//endregion
}
