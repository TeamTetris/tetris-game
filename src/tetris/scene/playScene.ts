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
		this._createFieldBackground();

		this._localPlayerField = this._newField(config.field.width, config.field.height, PLAYER_FIELD_DRAW_OFFSET);
		this._remotePlayerField = new RemoteField(this, config.field.width, config.field.height, new Vector2(420, 80));
		this._player = new LocalPlayer(this._localPlayerField, this.input.keyboard, this._biasEngine.newEventReceiver());
		
		this._networkingClient.receive("fieldUpdate", (args) => this._remotePlayerField.updateSprites(args.fieldState));

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
	private _remotePlayerField: RemoteField;
	private _fieldBackground: Phaser.GameObjects.Graphics;
	private _paused: boolean = false;
	private _pauseKey: Phaser.Input.Keyboard.Key;
	private _pauseButton: TextButton;
	private _changeScene: changeSceneFunction;
	private _networkingClient: NetworkingClient;
	//endregion

	//region private methods
	private _createFieldBackground(): void {
		this._fieldBackground = this.add.graphics();
		this._fieldBackground.fillStyle(0x002d4f);
		this._fieldBackground.fillRect(PLAYER_FIELD_DRAW_OFFSET.x, PLAYER_FIELD_DRAW_OFFSET.y, config.field.blockSize * config.field.width, config.field.blockSize * config.field.height);
	}

	private _newField(fieldWidth: number, fieldHeight: number, drawOffset: Vector2): Field {
		return new Field(fieldWidth, fieldHeight, drawOffset, this._brickFactory);
	}

	private _createUi() {
		const spacing: number = 5;
		this._pauseButton = new TextButton(this, 0, 0, "blue_button07.png", "blue_button08.png", "ii", () => this._changeScene(config.sceneKeys.menuScene));
		this._pauseButton.x =  config.field.blockSize * config.field.width - this._pauseButton.width / 2 - spacing;
		this._pauseButton.y = this._pauseButton.height / 2 + spacing;

		this._scoreText = this.add.text(0, 0, "0", config.defaultFontStyle);
	}
	//endregion
}
