/// <reference path="../../definitions/phaser.d.ts"/>

import "phaser";
import MainScene from "tetris/scene/mainScene";
import BiasEngine from "tetris/biasEngine/biasEngine"
import Profiler from "tetris/profiler/profiler";

const biasEngine = new BiasEngine();
const mainScene = new MainScene(biasEngine);

// main game configuration
const config: GameConfig = {
  width: 320,
  height: 576,
  type: Phaser.AUTO,
  parent: "game",
  scene: mainScene,
  "render.antialias": false,
};

// game class
export class Game extends Phaser.Game {

	//region public members
	//endregion

	//region public methods
	//endregion

	//region constructor
	public constructor(config: GameConfig) {
		super(config);

		this._biasEngine = biasEngine;
		this._profiler = new Profiler();
	}
	//endregion

	//region private members
	private readonly _biasEngine;
	private readonly _profiler;
	//endregion

	//region private methods
	//endregion
}

// when the page is loaded, create our game instance
window.onload = () => {
  const game = new Game(config);
};
