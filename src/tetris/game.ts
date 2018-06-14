/// <reference path="../../definitions/phaser.d.ts"/>

import "phaser";
import MainScene from "tetris/scene/mainScene";
import MenuScene from "tetris/scene/menuScene";
import BiasEngine from "tetris/biasEngine/biasEngine"
import Profiler from "tetris/profiler/profiler";
import "tetris/styles/scss/styles.scss"


// main game configuration
const config: GameConfig = {
  width: 320,
  height: 576,
  type: Phaser.AUTO,
  parent: "game",
  "render.antialias": false,
};


// game class
export class Game extends Phaser.Game {

	//region public members
	//endregion

	//region public methods
	public start() {
		super.start();
		const menuScene = new MenuScene(this.changeScene);
		const mainScene = new MainScene(this._biasEngine);
		this.scene.add('MenuScene', menuScene, true);
		this._activeScene = 'MenuScene';
		this.scene.add('MainScene', mainScene, true);
		this.changeScene('MenuScene');
	}
	
	public step(time: number, delta: number) {
		super.step(time, delta);
		this._profiler.update(time, delta);
		this._biasEngine.update(time, delta);
	}
	//endregion

	//region constructor
	public constructor(config: GameConfig) {
		super(config);
		this._profiler = new Profiler();
		this._biasEngine = new BiasEngine(profiler);
	}
	//endregion

	//region private members
	private readonly _biasEngine;
	private readonly _profiler;
	private _activeScene;
	//endregion

	//region private methods
	private changeScene(key: string) {
		this.scene.pause(this._activeScene);
		this.scene.bringToTop(key);
		this.scene.resume(key);
	}	
	//endregion
}

// when the page is loaded, create our game instance
window.onload = () => {
  const game = new Game(config);
};
