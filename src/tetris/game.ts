/// <reference path="../../definitions/phaser.d.ts"/>

import "phaser";
import MainScene from "tetris/scene/mainScene";
import MenuScene from "tetris/scene/menuScene";
import BiasEngine from "tetris/biasEngine/biasEngine"
import Profiler from "tetris/profiler/profiler";
import config from "tetris/config";
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
		const menuScene = new MenuScene(this.changeScene.bind(this));
		const mainScene = new MainScene(this._biasEngine, this.changeScene.bind(this));

		this.scene.add(config.sceneKeys.mainScene, mainScene);
		this.scene.add(config.sceneKeys.menuScene, menuScene, true);
		this._activeScene = config.sceneKeys.menuScene;
	}
	
	public step(time: number, delta: number) {
		super.step(time, delta);
		this._profiler.update(time, delta);
		this._biasEngine.update(time, delta);
	}
	//endregion

	//region constructor
	public constructor(gameConfig: GameConfig) {
		super(gameConfig);
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
	private changeScene(scene: string) {
		this.scene.switch(this._activeScene, scene);
		this.scene.swapPosition(this._activeScene, scene);
		this._activeScene = scene;
	}	
	//endregion
}

// when the page is loaded, create our game instance
window.onload = () => {
  const game = new Game(gameConfig);
};
