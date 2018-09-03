/// <reference path="../../../definitions/phaser.d.ts"/>

import Block from 'tetris/brick/block';
import Vector2 = Phaser.Math.Vector2;
import MatchPlayer, { BlockState } from 'tetris/interfaces/MatchPlayer';
import config from 'tetris/config';
import BlockState from "tetris/interfaces/MatchPlayer";

export default class RemoteField {
	//region public members
	get height(): number {
		return this._height * config.field.blockSize * this._drawScale;
	}

	get width(): number {
		return this._width * config.field.blockSize * this._drawScale;
	}

	get x(): number {
		return this._drawOffset.x;
	}

	get y(): number {
		return this._drawOffset.y;
	}

	set x(x: number) {
        this._drawOffset.x = x;
        this._adjustTextX();
	}

	set y(y: number) {
        this._drawOffset.y = y;
		this._adjustTextY();
	}
	//endregion

	//region public methods
	public update(player: MatchPlayer): void {
		this._updateSprites(player.field);
		this._updateText(player);
	}

	public destroy(): void {
		this._background.destroy();
		this._background = null;
		for (const blockRow of this._blockRows) {
			for (const block of blockRow) {
				block.destroy();
			}
		}
		this._blockRows = [];
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene,
						width: number,
						height: number,
						drawOffset: Vector2,
						background: Phaser.GameObjects.Graphics,
						drawScale: number) {
		this._scene = scene;
		this._width = width;
		this._height = height;
		this._drawScale = drawScale;
		this._background = background;
		this._blockRows = new Array(this._height);
		this._drawOffset = drawOffset;
		this._setup();
	}
	//endregion

	//region private members
	private _blockRows: Block[][];
	private readonly _width: number;
	private readonly _height: number;
	private readonly _drawScale: number;
	private readonly _drawOffset: Vector2;
	private _scene: Phaser.Scene;
	private _background: Phaser.GameObjects.Graphics;
	private _name: Phaser.GameObjects.Text;
	private _score: Phaser.GameObjects.Text;
	//endregion

	//region private methods
	private _setup(): void {
		this._setupField();
		this._setupText();
	}
	
	private _setupField(): void {
		this._blockRows = [];
		for (let y = 0; y < this._height; y++) {
			this._blockRows.push(new Array(this._width).fill(null));
			for (let x = 0; x < this._width; x++) {
				const sprite = this._scene.add.sprite(0, 0, config.atlasKeys.blockSpriteAtlasKey, "");
				this._blockRows[y][x] = new Block(sprite, [ new Vector2(x, y) ], null);
				this._blockRows[y][x].preDraw(this._drawOffset, this._drawScale);
				this._blockRows[y][x].sprite.setVisible(false);
			}
		}
	}

	private _setupText(): void {
		this._name = this._scene.add.text(this._drawOffset.x, this._drawOffset.y, " ", config.ui.fonts.scoreboard.font);
		this._score = this._scene.add.text(this._drawOffset.x, this._drawOffset.y, " ", config.ui.fonts.scoreboard.font);
		this._adjustTextX();
		this._adjustTextY();
	}

	private _updateSprites(serializedFieldState: Array<Array<BlockState>>): void {
		for (let y = 0; y < this._height; y++) {
			for (let x = 0; x < this._width; x++) {
				if (serializedFieldState[y][x]) {
					this._blockRows[y][x].sprite.setVisible(true);
					this._blockRows[y][x].sprite.setFrame(serializedFieldState[y][x].spriteFrameName);
				} else {
					this._blockRows[y][x].sprite.setVisible(false);
				}
			}
		}
	}

	private _updateText(player: MatchPlayer): void {
		this._name.setText(player.displayName);
		this._score.setText(player.points.toString());
		this._adjustTextX();
	}

	private _adjustTextX(): void {
		this._name.x = this.x + ( this.width - this._name.width ) / 2;
		this._score.x = this.x + ( this.width - this._score.width ) / 2;
    }

    private _adjustTextY(): void {
		this._name.y = this.y + this.height + this._name.height;
		this._score.y = this.y + this.height + this._score.height * 2.5;
    }
	//endregion
}
