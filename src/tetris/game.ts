/// <reference path="../../definitions/phaser.d.ts"/>

import "phaser";
import MainScene from "tetris/scene/mainScene";
import BiasEngine from "tetris/biasEngine/biasEngine"
import Profiler from "tetris/profiler/profiler";
// import "tetris/styles/scss/styles.scss"

const profiler = new Profiler();
const biasEngine = new BiasEngine(profiler);

// main game configuration
const config: GameConfig = {
  width: 320,
  height: 576,
  type: Phaser.AUTO,
  parent: "game",
  scene: new MainScene(biasEngine),
  "render.antialias": false,
};

// game class
export class Game extends Phaser.Game {

	//region public members
	//endregion

	//region public methods
	public step(time: number, delta: number) {
		super.step(time, delta);
		this._profiler.update(time, delta);
		this._biasEngine.update(time, delta);
	}
	//endregion

	//region constructor
	public constructor(config: GameConfig) {
		super(config);

		this._biasEngine = biasEngine;
		this._profiler = profiler;
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
