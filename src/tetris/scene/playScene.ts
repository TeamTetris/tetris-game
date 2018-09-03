/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from "tetris/field/field";
import Player from "tetris/player/player";
import BrickFactory from "tetris/brick/brickFactory";
import LocalPlayer from "tetris/player/localPlayer";
import config from "tetris/config";
import Vector2 = Phaser.Math.Vector2;
import FieldState from "tetris/field/fieldState";
import RemoteField from "tetris/field/remoteField";
import CountdownWidget from "tetris/ui/countdownWidget";
import ScoreboardWidget from "tetris/ui/scoreboardWidget";
import ScoreWidget from "tetris/ui/scoreWidget";
import Game from "tetris/game";
import Match from "tetris/interfaces/Match";
import MatchPlayer, { PlayStatus } from "tetris/interfaces/MatchPlayer";
import NetworkingEvents from "tetris/networking/networkingEvents";
import DebugWidget from "tetris/ui/debugWidget";

const PLAYER_FIELD_DRAW_OFFSET: Vector2 = new Vector2(
	(config.graphics.width - config.field.width * config.field.blockSize) / 2, 
	(config.graphics.height - config.field.height * config.field.blockSize) / 1.5);

export default class PlayScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.image(config.graphics.noiseTextureKey, "./assets/images/noise.png");
		this.load.glsl('interstellar', "./assets/shaders/interstellar.glsl");
		this.load.atlas(config.atlasKeys.blockSpriteAtlasKey, "./assets/images/blockSprites.png", "./assets/images/blockSprites.json");
	}

	public create(): void {
		this._createUi();

		this._localPlayerField = this._newField(config.field.width, config.field.height, PLAYER_FIELD_DRAW_OFFSET);
		this._player = new LocalPlayer(this._localPlayerField, this.input.keyboard, this._game.biasEngine.newEventReceiver());
		
		this._addRemoteFields();
		this._registerNetworkEvents();
	}

	public update(time: number, delta: number): void {
		this._localPlayerField.update(time, delta);
		this._player.update(time, delta);

		// Update UI widgets
		this._scoreWidget.update(this._localPlayerField.score.toString());

		const matchStart = new Date(this._match.startTime).valueOf() / 1000;
		const currentTime = Date.now() / 1000;
		const preGame = currentTime < matchStart;		
		if (!preGame && this._match.nextElimination) {
			const nextElimination = new Date(this._match.nextElimination).valueOf() / 1000;
			this._countdownWidget.update(Math.max(0, nextElimination - currentTime), Math.max(nextElimination - matchStart, matchStart - currentTime), preGame);
		} else {
			if (!this._matchStartTimer) {
				this._matchStartTimer = matchStart - currentTime;
			}
			this._countdownWidget.update(Math.max(0, matchStart - currentTime), this._matchStartTimer, preGame);	
		}

		this._pushMultiplayerUpdate();
		this._updateShaders(time);

		this._debugWidget.update(['ABCD', 'Some Player', 'Bias Event X active']);
	}

	public joinMatch(match: Match, localSocketId: String) {
		this._match = match;
		this._localSocketId = localSocketId;
	}

	public adjustBackgroundParameters(intensity: number, color: Array<number>) {
		this._backgroundGraphicsPipeline.setFloat1('uIntensity', intensity);
		this._backgroundGraphicsPipeline.setFloat3('uColor', color[0], color[1], color[2]);
	}
	//endregion

	//region constructor
	public constructor(game: Game) {
		super({
			key: "PlayScene"
		});
		this._game = game;
		this._brickFactory = new BrickFactory(this, this._game.biasEngine);
	}
	//endregion

	//region private members
	private readonly _brickFactory: BrickFactory;
	private _player: Player;
	private _localPlayerField: Field;
	private _match: Match;
	private _remotePlayerFields: RemoteField[];
	private _scoreWidget: ScoreWidget;
	private _countdownWidget: CountdownWidget;
	private _scoreboardWidget: ScoreboardWidget;
	private _debugWidget: DebugWidget;
	private readonly _game: Game;
	private _rainbowPipeline: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
	private _startTimerStarted: boolean;
	private _localSocketId: String;
	private _backgroundGraphicsPipeline: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
	private _backgroundSprite: Phaser.GameObjects.Sprite;
	private _matchStartTimer: number;
	//endregion
	
	//region private methods
	private _createBackground(): void {
		this._backgroundGraphicsPipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
			game: this._game,
			renderer: this._game.renderer, 
			fragShader: this.cache.shader.get('interstellar')
		});
		(this._game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('interstellar', this._backgroundGraphicsPipeline);

		this._backgroundGraphicsPipeline.setFloat2('uResolution', config.graphics.width, config.graphics.height);
		this._backgroundGraphicsPipeline.setFloat1('uTime', 0.0);
		this.adjustBackgroundParameters(0.10, [0.2, 0.2, 0.2]);

		this._backgroundSprite = this.add.sprite(config.graphics.width / 2, config.graphics.height / 2, config.graphics.noiseTextureKey);
		const scaleX = config.graphics.width / 256.0;
		const scaleY = config.graphics.height / 256.0;
		this._backgroundSprite.setScale(scaleX, scaleY);
		
		this._backgroundSprite.setPipeline('interstellar');
	}

	private _registerNetworkEvents(): void {
		this._game.networkingClient.receive(NetworkingEvents.MatchUpdate, this._updateMatch.bind(this));
	}

	private _startMatch(): void {
		if (this._localPlayerField.fieldState === FieldState.Loss) {
			return;
		}
		console.log('starting match');
		this.adjustBackgroundParameters(0.25, [0.7, 0.7, 0.7]);
		this._localPlayerField.reset();
	}

	private _updateMatch(match: Match): void {
		this._match = match;
		const matchHasStarted = Date.now() > Date.parse(match.startTime);
		if (!this._startTimerStarted && !matchHasStarted) {
			this._startTimerStarted = true;
			setTimeout(this._startMatch.bind(this), Date.parse(match.startTime) - Date.now(), {});
		}
		this._scoreboardWidget.update(this._localSocketId, match.players);
		this._updateRemoteFields(match.players);
		this._determinePlayStatus(match.players);
	}

	private _determinePlayStatus(players: MatchPlayer[]) : void {
		const currentPlayer = players.find(player => player.socketId === this._localSocketId);
		
		if (currentPlayer.playStatus === PlayStatus.Eliminated && this._localPlayerField.fieldState !== FieldState.Loss) {
			// Local player got eliminated
			this._processLoss();
		}
		if (currentPlayer.playStatus === PlayStatus.Won && this._localPlayerField.fieldState !== FieldState.Victory) {
			// Local player won
			this._processWin();
		}
	}

	private _addRemoteFields(): void {
		this._remotePlayerFields = [];
		const drawScale = 0.7;
		for (let index = 0; index < 2; index++) {
			const position = new Vector2(
				config.graphics.width / 20 + (config.field.width * config.field.blockSize * drawScale + config.ui.spacing) * index , 
				config.graphics.height / 4);
			const remoteField = new RemoteField(this, config.field.width, config.field.height, position, this._createFieldBackground(position, drawScale), drawScale);
			this._remotePlayerFields.push(remoteField);	
		}
	}

	private _updateRemoteFields(players: MatchPlayer[]): void {
		for (const [index, player] of players.slice(0, 2).entries()) {
			this._remotePlayerFields[index].updateSprites(player.field);
		}
	}

	private _processLoss(): void {
		console.log('Local player got eliminated');
		this.adjustBackgroundParameters(0.08, [0.5, 0.0, 0.0]);
		this._localPlayerField.fieldState = FieldState.Loss;
		if (this._localPlayerField.activeBrick) {
			this._localPlayerField.activeBrick.destroy();
			this._localPlayerField.activeBrick = null;
		}
	}

	private _processWin(): void {	
		console.log('Local player won');		
		this.adjustBackgroundParameters(0.08, [0.8, 0.6, 0.0]);
		this._localPlayerField.fieldState = FieldState.Victory;
		if (this._localPlayerField.activeBrick) {
			this._localPlayerField.activeBrick.destroy();
			this._localPlayerField.activeBrick = null;
		}
	}

	private _createFieldBackground(offset: Vector2, drawScale: number = 1): Phaser.GameObjects.Graphics {
		const fieldBackground = this.add.graphics();
		fieldBackground.fillStyle(0x002d4f);
		fieldBackground.lineStyle(1, 0xD4D4D4, 1);
		fieldBackground.strokeRect(offset.x, offset.y, config.field.blockSize * config.field.width * drawScale, config.field.blockSize * config.field.height * drawScale);
		return fieldBackground;
	}

	private _newField(fieldWidth: number, fieldHeight: number, drawOffset: Vector2): Field {
		this._createFieldBackground(drawOffset);
		return new Field(fieldWidth, fieldHeight, drawOffset, this._brickFactory);
	}

	private _createUi(): void {
		this._initializeShaders();

		this._createBackground();

		// create UI widgets
		this._scoreWidget = new ScoreWidget(this, config.graphics.width / 2, (config.graphics.height - config.field.height * config.field.blockSize) / 4);
		this._countdownWidget = new CountdownWidget(this, config.graphics.width / 5 * 4, config.graphics.height / 30 * 8);
		this._scoreboardWidget = new ScoreboardWidget(this, config.graphics.width / 5 * 4, config.graphics.height / 20 * 9);
		this._debugWidget = new DebugWidget(this, 100, 100);
	}

	private _initializeShaders(): void {
		this._rainbowPipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
			game: this._game,
			renderer: this._game.renderer, 
			fragShader: this.cache.shader.get('rainbow') 
		});
		(this._game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('rainbow-text', this._rainbowPipeline);
		this._rainbowPipeline.setFloat2('uResolution', config.graphics.width, config.graphics.height);
	}

	private _updateShaders(time: number): void {
		this._rainbowPipeline.setFloat1('uTime', time / 800);
		this._backgroundGraphicsPipeline.setFloat1('uTime', time / 1200);
	}

	private _pushMultiplayerUpdate(): void {
		if (this._localPlayerField.fieldStateChanged && this._localPlayerField.fieldState == FieldState.Loss) {
			this._localPlayerField.fieldStateChanged = false;
			this._processLoss();
			this._game.networkingClient.emit(NetworkingEvents.SelfEliminated, {});
		}

		if (this._localPlayerField.fieldState == FieldState.Playing && this._localPlayerField.blockStateChanged) {
			this._localPlayerField.blockStateChanged = false;
			const matchUpdate = {
				matchId: this._match.id,
				points: this._localPlayerField.score,
				field: this._localPlayerField.serializedBlockState,
			};
			this._game.networkingClient.emit(NetworkingEvents.MatchUpdate, matchUpdate);
		}
	}
	//endregion
}
