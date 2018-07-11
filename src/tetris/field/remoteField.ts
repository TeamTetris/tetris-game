/// <reference path="../../../definitions/phaser.d.ts"/>

import Block from 'tetris/brick/block';
import Vector2 = Phaser.Math.Vector2;
import config from 'tetris/config';

export default class RemoteField {
	//region public members
	//endregion

	//region public methods
	public updateSprites(serializedBlocks) {
		for(let y = 0; y < this._height; y++) {
			for(let x = 0; x < this._width; x++) {
				if (serializedBlocks[y][x]) {
					this._blockRows[y][x].sprite.setVisible(true);
					this._blockRows[y][x].sprite.setFrame(serializedBlocks[y][x].spriteFrameName);
				} else {
					this._blockRows[y][x].sprite.setVisible(false);
				}
			}
		}
	}

	public destroy() {
		this._background.destroy();
		this._background = null;
		this._blockRows.forEach(blockRow => {
			blockRow.forEach(block => {
				block.destroy();
			})
		});
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
		this._setupField();
	}
	//endregion

	//region private members
	private _blockRows: Block[][];
	private _width: number;
	private _height: number;
	private _drawScale: number;
	private _drawOffset: Vector2;
	private _scene: Phaser.Scene;
	private _background: Phaser.GameObjects.Graphics;
	//endregion

	//region private methods
	private _setupField() {
		this._blockRows = new Array(this._height);
		const iterator = this._blockRows.keys();
		for (let key of iterator) {
			this._blockRows[key] = new Array(this._width).fill(null);
		}
		for(let y = 0; y < this._height; y++) {
			for(let x = 0; x < this._width; x++) {
				const sprite = this._scene.add.sprite(0, 0, config.atlasKeys.blockSpriteAtlasKey, "");
				this._blockRows[y][x] = new Block(sprite, [ new Vector2(x, y) ], null);
				this._blockRows[y][x].preDraw(this._drawOffset, this._drawScale);
				this._blockRows[y][x].sprite.setVisible(false);
			}
		}
	}
	//endregion
}
