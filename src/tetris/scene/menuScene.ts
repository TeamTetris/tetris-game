/// <reference path="../../../definitions/phaser.d.ts"/>

import Vector2 = Phaser.Math.Vector2;

const FIELD_WIDTH: number = 10;
const FIELD_HEIGHT: number = 18;
const FIELD_DRAW_OFFSET: Vector2 = new Vector2(0, 0);
const BLOCK_SIZE: number = 32;

type changeSceneFunction = (key: string) => void;

export default class MainScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		
	}

	public create(): void {
		this._createFieldBackground();
		this._createPlayButton();
	}

	public update(time: number, delta: number): void {
		
	}
	//endregion

	//region constructor
	public constructor(changeScene: changeSceneFunction) {
		super({
			key: "MenuScene"
		});
		this._changeScene = changeScene;
	}
	//endregion

	//region private members
	private _fieldBackground: Phaser.GameObjects.Graphics;
	private _playButton: Phaser.GameObjects.Text;
	private _changeScene: changeSceneFunction;
	//endregion

	//region private methods
	private _createFieldBackground(): void {
		this._fieldBackground = this.add.graphics();
		this._fieldBackground.fillStyle(0x00ffff);
		this._fieldBackground.fillRect(FIELD_DRAW_OFFSET.x, FIELD_DRAW_OFFSET.y, BLOCK_SIZE * FIELD_WIDTH, BLOCK_SIZE * FIELD_HEIGHT);
	}

	private _createPlayButton(): void {
		this._playButton = this.add.text(0, 0, 'Play !');
		this._playButton.on('click', () => {
			this._changeScene('MainScene');
		});
	}
	//endregion
}
