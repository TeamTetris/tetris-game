/// <reference path="../../../definitions/phaser.d.ts"/>

import BiasEventReceiver from "tetris/biasEngine/biasEventReceiver";
import Field from "tetris/field/field";
import BrickBias from "tetris/brick/brickBias";
import Profiler from "tetris/profiler/profiler";
import Profile from "tetris/profiler/profile";
import Ethnicity from "tetris/profiler/profileValues/ethnicity";
import Gender from "tetris/profiler/profileValues/gender";
import PassportValue from "tetris/biasEngine/datasources/PassportValue";
import OperatingSystem from "tetris/profiler/profileValues/OperatingSystem";
import BiasEventGenerator from "tetris/biasEngine/biasEventGenerator";
import BiasEvent from "tetris/biasEngine/biasEvent";
import Utility from "tetris/utility";

interface CalculateBiasForProfileData {
	(profile: Profile): number
}

export default class BiasEngine {

	//region public members
	public static get MAX_NEGATIVE_BIAS_VALUE(): number {
		return 0.0;
	}

	public static get MAX_POSITIVE_BIAS_VALUE(): number {
		return 2.0;
	}

	public static get BIAS_RANGE(): number {
		return BiasEngine.MAX_POSITIVE_BIAS_VALUE - BiasEngine.MAX_NEGATIVE_BIAS_VALUE;
	}

	public static get NEUTRAL_BIAS_VALUE(): number {
		return BiasEngine.BIAS_RANGE * 0.5;
	}

	public static get BIAS_PROFILE_WEIGHTS(): Map<CalculateBiasForProfileData, number> {
		const biasProfileWeights = new Map();
		biasProfileWeights.set(BiasEngine._calculateAgeBias, 0.1);
		biasProfileWeights.set(BiasEngine._calculateBeautyBias, 0.2);
		biasProfileWeights.set(BiasEngine._calculateEthnicityBias, 0.5);
		biasProfileWeights.set(BiasEngine._calculateGenderBias, 0.15);
		biasProfileWeights.set(BiasEngine._calculateSkinAcneBias, 0.1);
		biasProfileWeights.set(BiasEngine._calculateSkinHealthBias, 0.05);
		biasProfileWeights.set(BiasEngine._calculateGlasesBias, 0.05);
		biasProfileWeights.set(BiasEngine._calculateLocationBias, 0.3);
		biasProfileWeights.set(BiasEngine._calculateOperatingSystemBias, 0.15);
		return biasProfileWeights;
	}

    // @ts-ignore
    public get currentBiasValue(): number {
        return this._currentBiasValue;
	}
	
	public get eventGenerator(): BiasEventGenerator {
		return this._biasEventGenerator;
	}
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		this._biasEventGenerator.update(time, delta);
	}

	public newEventReceiver(): BiasEventReceiver {
		return this._biasEventGenerator.newEventReceiver();
	}

	public newBrickBias(field: Field): BrickBias {
		return BrickBias.newFromTierList(field, this._currentBiasValue);
	}
	//endregion

	//region constructor
	public constructor(profiler: Profiler) {
		this._biasEventGenerator = new BiasEventGenerator(this);
		this._profiler = profiler;
		this._profiler.registerProfileChangedEventHandler(this._onProfileUpdate.bind(this));
	}
	//endregion

	//region private members
	private readonly _biasEventGenerator: BiasEventGenerator;
	private _currentBiasValue: number = BiasEngine.NEUTRAL_BIAS_VALUE;
	private _profiler: Profiler;
	//endregion

	//region private methods
	// @ts-ignore
	private set currentBiasValue(value: number) {
		this._currentBiasValue = Utility.limitValueBetweenMinAndMax(value, BiasEngine.MAX_NEGATIVE_BIAS_VALUE, BiasEngine.MAX_POSITIVE_BIAS_VALUE);
	}

	private _onProfileUpdate(profile: Profile): void {
		let newBiasValue = BiasEngine.NEUTRAL_BIAS_VALUE;

		BiasEngine.BIAS_PROFILE_WEIGHTS.forEach((weight, profileDataHandler) => {
			 newBiasValue += weight * profileDataHandler(profile);
		});
		this.currentBiasValue = newBiasValue;

		console.log("[biasEngine] New bias value calculated: ", this.currentBiasValue.toPrecision(3));
	}

	// Profile Bias Values START
	private static positiveBias(factor: number): number {
		factor = Utility.limitValueBetweenMinAndMax(factor, 0.0, 1.0);
		return (BiasEngine.MAX_POSITIVE_BIAS_VALUE - BiasEngine.NEUTRAL_BIAS_VALUE) * factor;
	}

	private static negativeBias(factor: number): number {
		factor = Utility.limitValueBetweenMinAndMax(factor, 0.0, 1.0);
		return (BiasEngine.MAX_NEGATIVE_BIAS_VALUE - BiasEngine.NEUTRAL_BIAS_VALUE) * factor;
	}

	private static relativeValueBiasWhereHigherIsBetter(value: number): number {
		const relative = value - 0.5;
		const factor = Math.abs(relative * 2);
		return relative >= 0 ? BiasEngine.positiveBias(factor) : BiasEngine.negativeBias(factor);
	}

	private static relativeValueBiasWhereLowerIsBetter(value: number): number {
		const relative = value - 0.5;
		const factor = Math.abs(relative * 2);
		return relative <= 0 ? BiasEngine.positiveBias(factor) : BiasEngine.negativeBias(factor);
	}

	private static _calculateAgeBias(profile: Profile): number {
		if (!profile.age) {
			return BiasEngine.positiveBias(0);
		}
		const relativeAge = profile.age - 40;
		const factor = Math.abs(relativeAge / 40);
		return relativeAge >= 0 ? BiasEngine.positiveBias(factor) : BiasEngine.negativeBias(factor);
	}

	private static _calculateBeautyBias(profile: Profile): number {
		if (!profile.beauty) {
			return BiasEngine.positiveBias(0);
		}
		return BiasEngine.relativeValueBiasWhereLowerIsBetter(profile.beauty);
	}

	private static _calculateEthnicityBias(profile: Profile): number {
		if(!profile.ethnicity) {
			return BiasEngine.positiveBias(0);
		}
		switch (profile.ethnicity) {
			case Ethnicity.White: {
				return BiasEngine.negativeBias(1);
			}
			case Ethnicity.Asian: {
				return BiasEngine.positiveBias(0.25);
			}
			case Ethnicity.Indian: {
				return BiasEngine.positiveBias(0.2);
			}
			case Ethnicity.Black: {
				return BiasEngine.positiveBias(1);
			}
			default: {
				return BiasEngine.negativeBias(0.7);
			}
		}
	}

	private static _calculateGenderBias(profile: Profile): number {
		if (!profile.gender) {
			return BiasEngine.positiveBias(0);
		}
		switch(profile.gender) {
			case Gender.Male: {
				return BiasEngine.negativeBias(1);
			}
			case Gender.Female: {
				return BiasEngine.positiveBias(1);
			}
			case Gender.Other: {
				return BiasEngine.positiveBias(0.5);
			}
			default: {
				return BiasEngine.negativeBias(0.7);
			}
		}
	}

	private static _calculateGlasesBias(profile: Profile): number {
		if (profile.glasses === undefined) {
			return BiasEngine.positiveBias(0);
		}
		return profile.glasses? BiasEngine.positiveBias(1): BiasEngine.negativeBias(1);
	}

	private static _calculateLocationBias(profile: Profile): number {
		if(!profile.location.value) {
			return BiasEngine.positiveBias(0);
		}
		const passportValue = PassportValue.instance.getScoreForCountry(profile.location.value.country);
		const passportValueRange = PassportValue.instance.maxScore - PassportValue.instance.minScore;
		const factor = (passportValue - PassportValue.instance.minScore) / passportValueRange;
		return BiasEngine.relativeValueBiasWhereLowerIsBetter(factor);
	}

	private static _calculateOperatingSystemBias(profile: Profile): number {
		if(!profile.operatingSystem || profile.operatingSystem === OperatingSystem.Undetected) {
			return BiasEngine.positiveBias(0);
		}
		switch(profile.operatingSystem) {
			case OperatingSystem.Android: {
				return BiasEngine.positiveBias(0.5);
			}
			case OperatingSystem.Linux_64: {
				return BiasEngine.positiveBias(0.70);
			}
			case OperatingSystem.Linux_32: {
				return BiasEngine.positiveBias(0.75);
			}
			case OperatingSystem.Mac: {
				return BiasEngine.negativeBias(1);
			}
			case OperatingSystem.Playstation3: {
				return BiasEngine.positiveBias(0.8);
			}
			case OperatingSystem.Playstation4: {
				return BiasEngine.positiveBias(0.6);
			}
			case OperatingSystem.WebTV: {
				return BiasEngine.positiveBias(1);
			}
			case OperatingSystem.Web_OS: {
				return BiasEngine.positiveBias(0.85);
			}
			case OperatingSystem.Windows: {
				return BiasEngine.negativeBias(0.8);
			}
			case OperatingSystem.iPad: {
				return BiasEngine.negativeBias(1);
			}
			case OperatingSystem.iPhone: {
				return BiasEngine.negativeBias(0.95);
			}
			case OperatingSystem.iPod: {
				return BiasEngine.positiveBias(0.2);
			}
			default: {
				return BiasEngine.positiveBias(0);
			}
		}
	}

	private static _calculateSkinAcneBias(profile: Profile): number {
		if (!profile.skinAcne) {
			return BiasEngine.positiveBias(0);
		}
		return BiasEngine.relativeValueBiasWhereHigherIsBetter(profile.skinAcne);
	}

	private static _calculateSkinHealthBias(profile: Profile): number {
		if (!profile.skinHealth) {
			return BiasEngine.positiveBias(0);
		}
		return BiasEngine.relativeValueBiasWhereLowerIsBetter(profile.skinHealth);
	}
	// Profile Bias Values END
	//endregion
}
