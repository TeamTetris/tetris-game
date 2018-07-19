/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from "tetris/field/field";
import Player from "tetris/player/player";
import BrickFactory from "tetris/brick/brickFactory";
import LocalPlayer from "tetris/player/localPlayer";
import TextButton from "tetris/ui/textButton";
import config from "tetris/config";
import Vector2 = Phaser.Math.Vector2;
import FieldState from "tetris/field/fieldState";
import RemoteField from "tetris/field/remoteField";
import CountdownWidget from "tetris/ui/countdownWidget";
import ScoreboardWidget from "tetris/ui/scoreboardWidget";
import ScoreWidget from "tetris/ui/scoreWidget";
import Game from "tetris/game";
import Match from "tetris/match/match";

const PLAYER_FIELD_DRAW_OFFSET: Vector2 = new Vector2(
	(config.graphics.width - config.field.width * config.field.blockSize) / 2, 
	(config.graphics.height - config.field.height * config.field.blockSize) / 1.5);

const players = [
	{
		rank: '1',
		name: 'KDA Player ;)',
		score: '9001',
		danger: false,
		ownScore: false,
	}, {
		rank: '2',
		name: 'Diamond Smurf 1337',
		score: '8442',
		danger: false,
		ownScore: false,
	}, {
		rank: '3',
		name: 'Rank 3 - Sad AF',
		score: '8245',
		danger: false,
		ownScore: false,
	}, {
		rank: '23',
		name: 'Some noob above you',
		score: '4520',
		danger: false,
		ownScore: false,
	}, {
		rank: '24',
		name: 'You',
		score: '4473',
		danger: false,
		ownScore: true,
	}, {
		rank: '25',
		name: 'Random player',
		score: '4320',
		danger: false,
		ownScore: false,
	}, {
		rank: '36',
		name: 'Bad Player',
		score: '3520',
		danger: true,
		ownScore: false,
	}, {
		rank: '37',
		name: 'AFK all day long',
		score: '892',
		danger: true,
		ownScore: false,
	}
];

export default class PlayScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas(config.atlasKeys.blockSpriteAtlasKey, "./assets/images/blockSprites.png", "./assets/images/blockSprites.json");
	}

	public create(): void {
		this._createUi();
		this._startMatch();

		this._playerFieldBackground = this._createFieldBackground(PLAYER_FIELD_DRAW_OFFSET);

		this._localPlayerField = this._newField(config.field.width, config.field.height, PLAYER_FIELD_DRAW_OFFSET);
		this._player = new LocalPlayer(this._localPlayerField, this.input.keyboard, this._game.biasEngine.newEventReceiver());
		
		this._setupNetworkingClient();
		this._game.networkingClient.connect();

		this._remotePlayerFields = new Map<string, RemoteField>();

		this._pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
	}

	public update(time: number, delta: number): void {
		if (Phaser.Input.Keyboard.JustDown(this._pauseKey)) {
			this._paused = !this._paused;
		}
		if (this._paused) {
			return;
		}
		this._localPlayerField.update(time, delta);
		this._player.update(time, delta);

		// Update UI widgets
		this._scoreWidget.update(this._localPlayerField.score.toString());
		this._countdownWidget.update(30 - (time / 1000 % 30), 30 );

		if (this._localPlayerField.fieldState == FieldState.Playing && this._localPlayerField.blockStateChanged) {
			this._localPlayerField.blockStateChanged = false;
			this._game.networkingClient.emit("fieldUpdate", { fieldState: this._localPlayerField.serializedBlockState});
		}
		this._updateShaders(time);
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
	private _paused: boolean = false;
	private _match: Match;
	private _pauseKey: Phaser.Input.Keyboard.Key;
	private _remotePlayerFields: Map<string, RemoteField>;
	private _remotePlayerFieldIndex = 0;
	private _playerFieldBackground: Phaser.GameObjects.Graphics;
	private _pauseButton: TextButton;
	private _scoreWidget: ScoreWidget;
	private _countdownWidget: CountdownWidget;
	private _scoreboardWidget: ScoreboardWidget;
	private readonly _game: Game;
	private _pipeline: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
	//endregion

	//region private methods
	private _setupNetworkingClient(): void {
		this._game.networkingClient.receive("playerLeft", (args) => {
			console.log('playerLeft:', args.id);
			this._removeRemoteField(args.id);
		});
		this._game.networkingClient.receive("playerJoined", (args) => {
			console.log('playerJoined:', args.id);
			this._addRemoteField(args.id);
		});
		this._game.networkingClient.receive("fieldUpdate", (args) => {
			const field = this._remotePlayerFields.get(args.id);
			if (!field) {
				console.warn("WARNING: Had to create player field; currentplayers MISSED?");
				this._addRemoteField(args.id);
			}
			field.updateSprites(args.fieldState);
		});
		this._game.networkingClient.receive("currentPlayers", (args) => {
			console.log("Received currentPlayers");
			args.players.forEach(player => {
				this._addRemoteField(player);
				this._remotePlayerFields.get(player).updateSprites(args.fields[player]);
			});
		});
	}

	private _addRemoteField(index: string): void {
		const position = new Vector2(420 + (this._remotePlayerFieldIndex % 4) * 180, 80 + Math.floor(this._remotePlayerFieldIndex / 4) * 300);
		this._remotePlayerFieldIndex++;
		this._remotePlayerFields.set(index, new RemoteField(this, config.field.width, config.field.height, position, this._createFieldBackground(position, 0.5), 0.5));
	}

	private _removeRemoteField(index: string): void {
		this._remotePlayerFields.get(index).destroy();
		this._remotePlayerFields.delete(index);
	}

	private _createFieldBackground(offset: Vector2, drawScale: number = 1): Phaser.GameObjects.Graphics {
		const fieldBackground = this.add.graphics();
		fieldBackground.fillStyle(0x002d4f);
		fieldBackground.lineStyle(1, 0xD4D4D4, 1);
		fieldBackground.strokeRect(offset.x, offset.y, config.field.blockSize * config.field.width * drawScale, config.field.blockSize * config.field.height * drawScale);
		return fieldBackground;
	}

	private _newField(fieldWidth: number, fieldHeight: number, drawOffset: Vector2): Field {
		return new Field(fieldWidth, fieldHeight, drawOffset, this._brickFactory);
	}

	private _createUi(): void {
		this._initializeShaders();

		const background = this.add.graphics();
		background.fillStyle(0x1E1E1E);
		background.fillRect(0, 0, config.graphics.width, config.graphics.height);

		const spacing: number = 5;
		this._pauseButton = new TextButton(this, 0, 0, "blue_button07.png", "blue_button08.png", "ii", () => this._endMatch());
		this._pauseButton.x =  config.graphics.width - this._pauseButton.width / 2 - spacing;
		this._pauseButton.y = this._pauseButton.height / 2 + spacing;

		// create UI widgets
		this._scoreWidget = new ScoreWidget(this, config.graphics.width / 2, (config.graphics.height - config.field.height * config.field.blockSize) / 4);
		this._countdownWidget = new CountdownWidget(this, config.graphics.width / 5 * 4, config.graphics.height / 30 * 8);
		this._scoreboardWidget = new ScoreboardWidget(this, config.graphics.width / 5 * 4, config.graphics.height / 20 * 9);
		this._scoreboardWidget.update(players);
	}

	private _initializeShaders(): void {
		this._pipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
			game: this._game,
			renderer: this._game.renderer, 
			fragShader: this.cache.shader.get('rainbow') 
		});
		(this._game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('rainbow-text', this._pipeline);
		this._pipeline.setFloat2('uResolution', config.graphics.width, config.graphics.height);
	}

	private _updateShaders(time: number): void {
		this._pipeline.setFloat1('uTime', time / 800);
	}

	private _startMatch(): void {
		this._match = new Match();
	}

	private _endMatch(): void {
		this._match.end(this._localPlayerField.score);
		this._game.handleEndOfMatch(this._match);
		this._game.changeScene(config.sceneKeys.menuScene);
	}
	//endregion
}
