"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MainScene"
        });
    }
    preload() {
        this.load.image("logo", "./assets/images/phaser.png");
    }
    create() {
        this.phaserSprite = this.add.sprite(400, 300, "logo");
    }
}
exports.MainScene = MainScene;
