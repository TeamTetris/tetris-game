/// <reference path="../../../definitions/phaser.d.ts"/>

import BiasEvent from "tetris/biasEngine/biasEvent";
import BiasEventType from "tetris/biasEngine/biasEventType";
import BiasEventReceiver from "tetris/biasEngine/biasEventReceiver";
import Field from "tetris/field/field";
import BrickBias from "tetris/brick/brickBias";
import Profiler from "tetris/profiler/profiler";
import Profile from "tetris/profiler/profile";
import Ethnicity from "tetris/profiler/profileValues/ethnicity";
import Gender from "tetris/profiler/profileValues/gender";

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
		return biasProfileWeights;
	}
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		if (time > this._timestampOfLastBiasEvent + this._biasEventTimeInterval) {
			this._timestampOfLastBiasEvent = time;
			this._spawnBiasEvent();
		}
	}

	public newEventReceiver(): BiasEventReceiver {
		const receiver = new BiasEventReceiver();
		this._biasEventReceivers = this._biasEventReceivers.concat(receiver);

		return receiver;
	}

	public newBrickBias(field: Field): BrickBias {
		return BrickBias.newFromTierList(field, this._currentBiasValue);
	}
	//endregion

	//region constructor
	public constructor(profiler: Profiler) {
		this._profiler = profiler;
		this._profiler.registerProfileChangedEventHandler(this._onProfileUpdate.bind(this));
	}
	//endregion

	//region private members
	private static POSSIBLE_EVENTS: BiasEventType[];
	private _timestampOfLastBiasEvent: number = 0;
	private _biasEventTimeInterval: number = 10000;
	private _biasEventReceivers: BiasEventReceiver[] = [];
	private _currentBiasValue: number = BiasEngine.NEUTRAL_BIAS_VALUE;
	private _profiler: Profiler;
	//endregion

	//region private methods
	private get currentBiasValue(): number {
		return this._currentBiasValue;
	}

	private set currentBiasValue(value: number) {
		this._currentBiasValue = Math.min(BiasEngine.MAX_POSITIVE_BIAS_VALUE, Math.max(BiasEngine.MAX_NEGATIVE_BIAS_VALUE, value));
	}

	private _onProfileUpdate(profile: Profile): void {
		let newBiasValue = BiasEngine.NEUTRAL_BIAS_VALUE;

		BiasEngine.BIAS_PROFILE_WEIGHTS.forEach((weight, profileDataHandler) => {
			 newBiasValue += weight * profileDataHandler(profile);
		});
		this.currentBiasValue = newBiasValue;

		console.log("[profiler] Profile updated. Age: " + profile.age + " Ethnicity: " + profile.ethnicity + " Gender: " + profile.gender);
		console.log("[biasEngine] New bias value calculated:", newBiasValue.toPrecision(3));
	}

	private _sendBiasEvent(event: BiasEvent): void {
		this._biasEventReceivers.forEach((eventReceiver) => eventReceiver.receiveEvent(event));
	}

	private _spawnBiasEvent(): void {

	}

	// Profile Bias Values START
	private static positiveBias(factor: number): number {
		factor = Math.min(1, Math.max(0, factor));
		return (BiasEngine.MAX_POSITIVE_BIAS_VALUE - BiasEngine.NEUTRAL_BIAS_VALUE) * factor;
	}

	private static negativeBias(factor: number): number {
		factor = Math.min(1, Math.max(0, factor));
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
		return relative <= 0 ? BiasEngine.negativeBias(factor) : BiasEngine.positiveBias(factor);
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
			case Ethnicity.WHITE: {
				return BiasEngine.negativeBias(1);
			}
			case Ethnicity.ASIAN: {
				return BiasEngine.positiveBias(0.25);
			}
			case Ethnicity.INDIAN: {
				return BiasEngine.positiveBias(0.2);
			}
			case Ethnicity.BLACK: {
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
			case Gender.MALE: {
				return BiasEngine.negativeBias(1);
			}
			case Gender.FEMALE: {
				return BiasEngine.positiveBias(1);
			}
			case Gender.OTHER: {
				return BiasEngine.positiveBias(0.5);
			}
			default: {
				return BiasEngine.negativeBias(0.7);
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
