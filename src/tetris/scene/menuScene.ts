/// <reference path="../../../definitions/phaser.d.ts"/>

import TextButton from "tetris/ui/textButton";
import config from "tetris/config";
import Game from "tetris/game";
import PlayScene from "tetris/scene/playScene";
import MatchmakingInfo from "tetris/interfaces/MatchmakingInfo";
import JoinResult from "tetris/interfaces/JoinResult";
import NetworkingEvents from "tetris/networking/networkingEvents";
import Match from "tetris/match/match";

export default class MenuScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas(config.atlasKeys.blockSpriteAtlasKey, "./assets/images/blockSprites.png", "./assets/images/blockSprites.json");
		this.load.atlas(config.atlasKeys.uiSpriteAtlasKey, "./assets/images/uiSprites.png", "./assets/images/uiSprites.json");
		this.load.atlas(config.atlasKeys.goldChestAtlasKey, "./assets/images/goldChest.png", "./assets/images/chestSprites.json");
		this.load.atlas(config.atlasKeys.bronzeChestAtlasKey, "./assets/images/bronzeChest.png", "./assets/images/chestSprites.json");
		this.load.atlas(config.atlasKeys.silverChestAtlasKey, "./assets/images/silverChest.png", "./assets/images/chestSprites.json");
		this.load.atlas(config.atlasKeys.diamondChestAtlasKey, "./assets/images/diamondChest.png", "./assets/images/chestSprites.json");
		this.load.atlas(config.atlasKeys.cyberChestAtlasKey, "./assets/images/cyberChest.png", "./assets/images/chestSprites.json");
		this.load.image(config.graphics.noiseTextureKey, "./assets/images/noise.png");
		this.load.image(config.graphics.lockTextureKey, "./assets/images/lock.png");
		this.load.bitmapFont(config.ui.fontKeys.kenneyMiniSquare, "./assets/font/KenneyMiniSquare.png", "./assets/font/KenneyMiniSquare.fnt", );
		this.load.glsl('rainbow', "./assets/shaders/rainbow.glsl");
		this.load.glsl('interstellar', "./assets/shaders/interstellar.glsl");
	}

	public create(): void {
		this._createBackground();
		this._createButtons();
		this._registerNetworkEvents();
		this._game.networkingClient.connect();
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

		document.querySelector('#register-button').addEventListener(
			'click',
			this._setLocalPlayerName.bind(this)
		);

		document.querySelector('#playername').addEventListener(
			'DOMSubtreeModified',
			MenuScene._setRegisterButtonState
		);
	}
	//endregion

	//region private members
	private _background: Phaser.GameObjects.Sprite;
	private _playButton: TextButton;
	private _collectionButton: TextButton;
	private _lootboxButton: TextButton;
	private _exitButton: TextButton;
	private readonly _game: Game;
	private _pipeline: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
	private _localPlayerName: String;
	//endregion

	//region private methods
	private static _setRegisterButtonState(event: Event): void {
		const inputValue: string = (event.target as any).textContent;
		const registerButton: HTMLButtonElement = document.querySelector('#register-button');

		if (inputValue === '' && !registerButton.disabled) {
			registerButton.disabled = true;
		} else if (inputValue !== '' && registerButton.disabled) {
			registerButton.disabled = false;
		};
	}

	private _setLocalPlayerName(): void {
		const input: HTMLDivElement = document.querySelector('#playername');
		this._localPlayerName = input.innerHTML;
	}

	private _createBackground(): void {
		const backgroundGraphics = this.add.graphics();
		this._pipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
			game: this._game,
			renderer: this._game.renderer, 
			fragShader: this.cache.shader.get('rainbow') 
		});
		(this._game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('rainbowMenu', this._pipeline);

		
		backgroundGraphics.fillStyle(0xffffff);
		backgroundGraphics.fillRect(0, 0, config.graphics.width, config.graphics.height);
		backgroundGraphics.generateTexture('backgroundGraphics');
		this._background = this.add.sprite(config.graphics.width / 2, config.graphics.height / 2, 'backgroundGraphics');
		this._pipeline.setFloat2('uResolution', config.graphics.width, config.graphics.height);
		this._pipeline.setFloat3('uTint', 1.0, 1.0, 1.0);
		this._pipeline.setFloat1('uZoom', 1.0);

		this._background.setPipeline('rainbowMenu');
	}

	private _createButtons(): void {
		const buttonPositionX: number = config.graphics.width / 2;
		const menuStartY: number = config.graphics.height / 3;
		const spacing: number = 20;

		this._playButton = new TextButton(
			this, 
			buttonPositionX, 
			0, 
			"green_button00.png", 
			"green_button01.png", 
			"Quick Match", 
			this._joinMatchmaking.bind(this)
		);
		this._collectionButton = new TextButton(
			this, 
			buttonPositionX, 
			0, 
			"blue_button00.png", 
			"blue_button01.png", 
			"My Collection", 
			this._game.changeScene.bind(this._game, config.sceneKeys.collectionScene) 
		);
		this._lootboxButton = new TextButton(
			this, 
			buttonPositionX, 
			0, 
			"blue_button00.png", 
			"blue_button01.png", 
			"Open Lootboxes", 
			this._game.changeScene.bind(this._game, config.sceneKeys.lootboxScene) 
		);
		this._exitButton = new TextButton(
			this, 
			buttonPositionX, 
			0, 
			"red_button01.png", 
			"red_button00.png", 
			"Exit Game", 
			this._game.exit
		);

		this._playButton.y = menuStartY;
		this._collectionButton.y = menuStartY + this._playButton.height + spacing;
		this._lootboxButton.y = this._collectionButton.y + this._collectionButton.height + spacing;
		this._exitButton.y = this._lootboxButton.y + this._lootboxButton.height + spacing;
	}

	private _joinMatchmaking(): void {
		this._game.networkingClient.emit(NetworkingEvents.JoinMatchmaking, {});
	}

	private _leaveMatchmaking(): void {
		this._game.networkingClient.emit(NetworkingEvents.LeaveMatchmaking, {});
	}

	private _registerNetworkEvents(): void {
		this._game.networkingClient.receive(NetworkingEvents.MatchmakingUpdate, MenuScene._updateMatchmakingInfo.bind(this));
		this._game.networkingClient.receive(NetworkingEvents.MatchReady, this._joinMatch.bind(this));
	}

	private static _updateMatchmakingInfo(matchmakingUpdate: MatchmakingInfo): void {
		console.log("matchmakingUpdate: " + JSON.stringify(matchmakingUpdate));
	}

	private _joinMatch(serverMatch: object): void {
		const match = new Match(serverMatch);
		this._game.networkingClient.emit(NetworkingEvents.JoinMatch, { matchId: match.id, displayName: this._localPlayerName }, (result: JoinResult) => {
			console.log('joinresult: ', JSON.stringify(result));
			if (result.success) {
				this._game.changeScene(config.sceneKeys.playScene);
				this._game.handleStartOfMatch(match);
				(this.scene.get(config.sceneKeys.playScene) as PlayScene).joinMatch(match, this._game.networkingClient.socketId);
			} else {
				console.error(`Could not join match ${match.id}. ${result.message}`);
			}
		});
	}

 	//endregion
}
