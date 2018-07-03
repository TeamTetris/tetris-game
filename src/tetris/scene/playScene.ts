/// <reference path="../../../definitions/phaser.d.ts"/>

import Field from "tetris/field/field";
import Player from "tetris/player/player";
import BrickFactory from "tetris/brick/brickFactory";
import BiasEngine from "tetris/biasEngine/biasEngine";
import LocalPlayer from "tetris/player/localPlayer";
import TextButton from "tetris/ui/textButton";
import config from "tetris/config";
import Vector2 = Phaser.Math.Vector2;
import { Input } from "phaser";
import NetworkingClient from "tetris/networking/networkingClient";
import FieldState from "tetris/field/fieldState";
import RemoteField from "tetris/field/remoteField";

const PLAYER_FIELD_DRAW_OFFSET: Vector2 = new Vector2(50, 80);

type changeSceneFunction = (scene: string) => void;

export default class PlayScene extends Phaser.Scene {

	//region public members
	//endregion

	//region public methods
	public preload(): void {
		this.load.atlas(config.atlasKeys.blockSpriteAtlasKey, "./assets/images/blockSprites.png", "./assets/images/blockSprites.json");
	}

	public create(): void {
		this._playerFieldBackground = this._createFieldBackground(PLAYER_FIELD_DRAW_OFFSET);

		this._localPlayerField = this._newField(config.field.width, config.field.height, PLAYER_FIELD_DRAW_OFFSET);
		this._player = new LocalPlayer(this._localPlayerField, this.input.keyboard, this._biasEngine.newEventReceiver());
		
		this._networkingClient.receive("playerLeft", (args) => {
			this._removeRemoteField(args.id);
		});
		this._networkingClient.receive("playerJoined", (args) => {
			this._addRemoteField(args.id);
		});
		this._networkingClient.receive("fieldUpdate", (args) => {
			const field = this._remotePlayerFields.get(args.id);
			if (!field) {
				this._addRemoteField(args.id);
			}
			field.updateSprites(args.fieldState);
		});
		this._networkingClient.connect();

		this._remotePlayerFields = new Map<string, RemoteField>();

		this._createUi();
		this._pauseKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.C);
	}

	public update(time: number, delta: number): void {
		if (Input.Keyboard.JustDown(this._pauseKey)) {
			this._paused = !this._paused;
		}
		if (this._paused) {
			return;
		}
		this._field.update(time, delta);
		this._localPlayerField.update(time, delta);
		this._player.update(time, delta);

		this._scoreText.setText(this._localPlayerField.score.toString());

		if (this._localPlayerField.fieldState == FieldState.Playing && this._localPlayerField.blockStateChanged) {
			this._localPlayerField.blockStateChanged = false;
			this._networkingClient.emit("fieldUpdate", { fieldState: this._localPlayerField.serializedBlockState});
		}
	}
	//endregion

	//region constructor
	public constructor(biasEngine: BiasEngine, changeScene: changeSceneFunction, networkingClient: NetworkingClient) {
		super({
			key: "PlayScene"
		});
		this._biasEngine = biasEngine;
		this._brickFactory = new BrickFactory(this, biasEngine);
		this._changeScene = changeScene;
		this._networkingClient = networkingClient;
	}
	//endregion

	//region private members
	private _scoreText: Phaser.GameObjects.Text;
	private readonly _biasEngine: BiasEngine;
	private readonly _brickFactory: BrickFactory;
	private _player: Player;
	private _localPlayerField: Field;
	private _paused: boolean = false;
	private _pauseKey: Phaser.Input.Keyboard.Key;
	private _remotePlayerFields: Map<string, RemoteField>;
	private _remotePlayerFieldIndex = 0;
	private _playerFieldBackground: Phaser.GameObjects.Graphics;
	private _pauseButton: TextButton;
	private _changeScene: changeSceneFunction;
	private _networkingClient: NetworkingClient;
	//endregion

	//region private methods
	private _addRemoteField(index: string) {
		const position = new Vector2(420 + (this._remotePlayerFieldIndex % 4) * 180, 80 + Math.floor(this._remotePlayerFieldIndex / 4) * 300);
		this._remotePlayerFieldIndex++;
		this._remotePlayerFields.set(index, new RemoteField(this, config.field.width, config.field.height, position, this._createFieldBackground(position, 0.5), 0.5));
	}

	private _removeRemoteField(index: string) {
		this._remotePlayerFields.get(index).destroy();
		this._remotePlayerFields.delete(index);
	}

	private _createFieldBackground(offset: Vector2, drawScale: number = 1): Phaser.GameObjects.Graphics {
		const fieldBackground = this.add.graphics();
		fieldBackground.fillStyle(0x002d4f);
		fieldBackground.fillRect(offset.x, offset.y, config.field.blockSize * config.field.width * drawScale, config.field.blockSize * config.field.height * drawScale);
		return fieldBackground;
	}

	private _newField(fieldWidth: number, fieldHeight: number, drawOffset: Vector2): Field {
		return new Field(fieldWidth, fieldHeight, drawOffset, this._brickFactory);
	}

	private _createUi() {
		const spacing: number = 5;
		this._pauseButton = new TextButton(this, 0, 0, "blue_button07.png", "blue_button08.png", "ii", () => this._changeScene(config.sceneKeys.menuScene));
		this._pauseButton.x =  config.graphics.width - this._pauseButton.width / 2 - spacing;
		this._pauseButton.y = this._pauseButton.height / 2 + spacing;
		this._scoreText = this.add.text(PLAYER_FIELD_DRAW_OFFSET.x, PLAYER_FIELD_DRAW_OFFSET.y, "0", config.defaultLargeFontStyle);
	}
	//endregion
}
