/// <reference path="../../definitions/phaser.d.ts"/>

import "phaser";
import MainScene from "tetris/scene/mainScene";
import BiasEngine from "tetris/biasEngine/biasEngine"

// main game configuration
const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: MainScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  }
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

		this._biasEngine = new BiasEngine();
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
