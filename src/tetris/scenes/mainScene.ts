/// <reference path="../../../definitions/phaser.d.ts"/>


import Field from "../field/field";
import Player from "../player/player";
import BrickFactory from "../brickFactory/brickFactory";

const GAME_WIDTH: number = 800;
const GAME_HEIGHT: number = 600;

export class MainScene extends Phaser.Scene {
	private phaserSprite: Phaser.GameObjects.Sprite;
	private player: Player;
	private field: Field;


	constructor() {
		super({
			key: "MainScene"
		});
		this.player = new Player();
		this.field = new Field(GAME_WIDTH, GAME_HEIGHT, new BrickFactory());
	}

	preload(): void {
		this.load.image("logo", "./assets/images/phaser.png");
	}

	create(): void {
		this.phaserSprite = this.add.sprite(400, 300, "logo");
	}

	update(time: number, interval: number) {

	}
}
