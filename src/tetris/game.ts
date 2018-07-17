/// <reference path="../../definitions/phaser.d.ts"/>

import "phaser";
import PlayScene from "tetris/scene/playScene";
import MenuScene from "tetris/scene/menuScene";
import BiasEngine from "tetris/biasEngine/biasEngine"
import Profiler from "tetris/profiler/profiler";
import config from "tetris/config";
import "tetris/styles/scss/styles.scss";
import NetworkingClient from "tetris/networking/networkingClient";



// main game configuration
const gameConfig: GameConfig = {
	width: config.graphics.width,
	height: config.graphics.height,
	type: Phaser.WEBGL,
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
		const menuScene = new MenuScene(this, this.changeScene.bind(this));
		const playScene = new PlayScene(this, this._biasEngine, this.changeScene.bind(this), this._networkingClient);

		this.scene.add(config.sceneKeys.playScene, playScene);
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
		this._biasEngine = new BiasEngine(this._profiler);
		this._networkingClient = new NetworkingClient(); 
	}
	//endregion

	//region private members
	private readonly _biasEngine;
	private readonly _profiler;
	private readonly _networkingClient;
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
