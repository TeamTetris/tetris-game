/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from "../field/field";
import Player from "../player/player";
import BrickFactory from "../brickFactory/brickFactory";

const GAME_WIDTH: number = 18;
const GAME_HEIGHT: number = 10;

export class MainScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.image("logo", "./assets/images/phaser.png");
	}

	public create(): void {
		this.phaserSprite = this.add.sprite(400, 300, "logo");
	}

	public update(time: number, interval: number): void {

	}
	//endregion

	//region constructor
	public constructor() {
		super({
			key: "MainScene"
		});
		this.player = new Player();
		this.field = new Field(GAME_WIDTH, GAME_HEIGHT, new BrickFactory());
	}
	//endregion

	//region private members
	private phaserSprite: Phaser.GameObjects.Sprite;
	private player: Player;
	private field: Field;
	//endregion

	//region private methods
	//endregion
}
