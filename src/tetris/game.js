"use strict";
/// <reference path="../../definitions/phaser.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
const mainScene_1 = require("./scenes/mainScene");
// main game configuration
const config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: "game",
    scene: mainScene_1.MainScene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 }
        }
    }
};
// game class
class Game extends Phaser.Game {
    constructor(config) {
        super(config);
    }
}
exports.Game = Game;
// when the page is loaded, create our game instance
window.onload = () => {
    const game = new Game(config);
};
