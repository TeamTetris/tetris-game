/// <reference path="../../definitions/phaser.d.ts"/>

import "phaser";
import PlayScene from "tetris/scene/playScene";
import MenuScene from "tetris/scene/menuScene";
import BiasEngine from "tetris/biasEngine/biasEngine"
import Profiler from "tetris/profiler/profiler";
import config from "tetris/config";
import "tetris/styles/scss/styles.scss";
import NetworkingClient from "tetris/networking/networkingClient";
import Match from "tetris/match/match";
import CreateProfileDialog from "tetris/ui/dialog/createProfileDialog";
import CollectionScene from "tetris/scene/collectionScene";
import SkinStorage from "tetris/brick/skinStorage";
import EvaluationView from "tetris/ui/dialog/evaluationView";
import LootboxScene from "tetris/scene/lootboxScene";
import LootboxStorage from "tetris/lootbox/lootboxStorage";
import { LootboxType } from "tetris/lootbox/lootboxType";

// main game configuration
const gameConfig: GameConfig = {
	width: config.graphics.width,
	height: config.graphics.height,
	type: Phaser.WEBGL,
	parent: "game",
	render: {
		antialias: true,		
	}
};


// game class
export default class Game extends Phaser.Game {

	//region public members
	public get networkingClient(): NetworkingClient {
		return this._networkingClient;
	}

	public get biasEngine(): BiasEngine {
		return this._biasEngine;
	}

	public get profiler(): Profiler {
		return this._profiler;
	}

	public exit(): void {
		const evaluationDialog = new EvaluationView(this);
		evaluationDialog.show();
	}
	//endregion

	//region public methods
	public start(): void {
		super.start();
		const menuScene = new MenuScene(this);
		const playScene = new PlayScene(this, this._skinStorage);
		const collectionScene = new CollectionScene(this, this._skinStorage);
		const lootboxScene = new LootboxScene(this, this._skinStorage, this._lootboxStorage);

		this.scene.add(config.sceneKeys.menuScene, menuScene, true);
		this.scene.add(config.sceneKeys.playScene, playScene);
		this.scene.add(config.sceneKeys.collectionScene, collectionScene);
		this.scene.add(config.sceneKeys.lootboxScene, lootboxScene);
		this._activeScene = config.sceneKeys.menuScene;
		this._createGameProfile();
	}
	
	public step(time: number, delta: number): void {
		super.step(time, delta);
		this._profiler.update(time, delta);
		this._biasEngine.update(time, delta);
	}

	public changeScene(scene: string): void {
		this.scene.switch(this._activeScene, scene);
		this.scene.swapPosition(this._activeScene, scene);
		this._activeScene = scene;
	}

	public onStartOfMatch(subscriberCallback: (match: Match) => void): void {
		this._startOfMatchSubscribers.push(subscriberCallback);
	}

	public handleStartOfMatch(match: Match): void {
		this._startOfMatchSubscribers.forEach(callback => callback(match));
	}

	public onEndOfMatch(subscriberCallback: (match: Match) => void): void {
		this._endOfMatchSubscribers.push(subscriberCallback);
	}

	public handleEndOfMatch(match: Match): void {
		this._endOfMatchSubscribers.forEach(callback => callback(match));
	}
	//endregion

	//region constructor
	public constructor(gameConfig: GameConfig) {
		super(gameConfig);
		this._endOfMatchSubscribers = [];
		this._startOfMatchSubscribers = [];
		this._profiler = new Profiler(this);
		this._skinStorage = new SkinStorage();
		this._lootboxStorage = new LootboxStorage();
		this._biasEngine = new BiasEngine(this._profiler);
		this._networkingClient = new NetworkingClient();
		this.exit = this.exit.bind(this);
	}
	//endregion

	//region private members
	private readonly _biasEngine: BiasEngine;
	private readonly _profiler: Profiler;
	private readonly _skinStorage: SkinStorage;
	private readonly _lootboxStorage: LootboxStorage;
	private readonly _networkingClient: NetworkingClient;
	private readonly _endOfMatchSubscribers: ((match: Match) => void)[];
	private readonly _startOfMatchSubscribers: ((match: Match) => void)[];
	private _activeScene: string;
	//endregion

	//region private methods
	private async _createGameProfile(): Promise<void> {
		const createProfileDialog = CreateProfileDialog.display();
		createProfileDialog.show();
		await createProfileDialog.awaitResult();
		if (createProfileDialog.getRewards) {
			this._lootboxStorage.modifyAmount(LootboxType.Diamond, 5);
			this._lootboxStorage.modifyAmount(LootboxType.Cyber, 2);
		}
	}
	//endregion
}

// when the page is loaded, create our game instance
window.onload = () => {
  new Game(gameConfig);
};
