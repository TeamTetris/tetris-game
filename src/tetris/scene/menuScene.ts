/// <reference path="../../../definitions/phaser.d.ts"/>

import TextButton from "tetris/ui/textButton";
import config from "tetris/config";
import Game from "tetris/game";
import PlayScene from "tetris/scene/playScene";
import MatchmakingInfo from "tetris/interfaces/MatchmakingInfo";
import Match from "tetris/interfaces/Match";
import JoinResult from "tetris/interfaces/JoinResult";

export default class MenuScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas(config.atlasKeys.uiSpriteAtlasKey, "./assets/images/uiSprites.png", "./assets/images/uiSprites.json");
		this.load.glsl('rainbow', "./assets/shaders/rainbow.glsl")
	}

	public create(): void {
		this._createBackground();
		this._createButtons();
		this._registerNetworkEvents();
	}

	public update(time: number, delta: number): void {
		this._pipeline.setFloat1('uTime', time / 800);
	}
	//endregion

	//region constructor
	public constructor(game: Game) {
		super({
			key: "MenuScene"
		});
		this._game = game;
	}
	//endregion

	//region private members
	private _background: Phaser.GameObjects.Sprite;
	private _playButton: TextButton;
	private _optionsButton: TextButton;
	private readonly _game: Game;
	private _pipeline: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
	//endregion

	//region private methods
	private _createBackground(): void {
		const backgroundGraphics = this.add.graphics();
		this._pipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
			game: this._game,
			renderer: this._game.renderer, 
			fragShader: this.cache.shader.get('rainbow') 
		});
		(this._game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('rainbow', this._pipeline);

		this._pipeline.setFloat2('uResolution', config.graphics.width, config.graphics.height);

		backgroundGraphics.fillStyle(0xffffff);
		backgroundGraphics.fillRect(0, 0, config.graphics.width, config.graphics.height);
		backgroundGraphics.generateTexture('backgroundGraphics');
		this._background = this.add.sprite(config.graphics.width / 2, config.graphics.height / 2, 'backgroundGraphics');

		this._background.setPipeline('rainbow');
	}

	private _createButtons(): void {
		const menuStartX: number = config.graphics.width / 2;
		const menuStartY: number = config.graphics.height / 3;
		const spacing: number = 20;
		this._playButton = new TextButton(this, menuStartX, 0, "blue_button00.png", "blue_button01.png", "Join Matchmaking", this._joinMatchmaking.bind(this));
		this._optionsButton = new TextButton(this, menuStartX, 0, "blue_button00.png", "blue_button01.png", "Leave Matchmaking", this._leaveMatchmaking.bind(this));
		this._playButton.y = menuStartY;
		this._optionsButton.y = menuStartY + this._playButton.height + spacing;
	}

	private _joinMatchmaking(): void {
		this._game.networkingClient.emit("joinMatchmaking", {});
	}

	private _leaveMatchmaking(): void {
		this._game.networkingClient.emit("leaveMatchmaking", {});
	}

	private _registerNetworkEvents(): void {
		this._game.networkingClient.receive("matchmakingUpdate", this._updateMatchmakingInfo.bind(this));
		this._game.networkingClient.receive("matchReady", this._joinMatch.bind(this));
	}

	private _updateMatchmakingInfo(matchmakingUpdate: MatchmakingInfo) {
		// TODO: Update Matchmaking Widget
		console.log("matchmakingUpdate: " + JSON.stringify(matchmakingUpdate));
	}

	private _joinMatch(match: Match): void {
		this._game.networkingClient.emit("joinMatch", { matchId: match.id }, (result: JoinResult) => {
			console.log('joinresult: ', JSON.stringify(result));
			if (result.success) {
				this._game.changeScene(config.sceneKeys.playScene);
				(this.scene.get(config.sceneKeys.playScene) as PlayScene).joinMatch(result.match);
			} else {
				// TODO: Display Matchmaking Error
				console.error(`Could not join match ${match.id}. ${result.message}`);
			}
		});
	}

 	//endregion
}
