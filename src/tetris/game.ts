/// <reference path="../../definitions/phaser.d.ts"/>

import "phaser";
import MainScene from "tetris/scene/mainScene";
import BiasEngine from "tetris/biasEngine/biasEngine"

const biasEngine = new BiasEngine();
const mainScene = new MainScene(biasEngine);

// main game configuration
const config: GameConfig = {
  width: 800,
  height: 600,
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
	}
	//endregion

	//region private members
	private readonly _biasEngine;
	//endregion

	//region private methods
	//endregion
}

// when the page is loaded, create our game instance
window.onload = () => {
  const game = new Game(config);
};
