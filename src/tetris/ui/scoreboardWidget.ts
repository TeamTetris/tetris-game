/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import MatchPlayer, { ScoreboardStatus, PlayStatus } from "tetris/interfaces/MatchPlayer";
import Font from 'tetris/interfaces/Font';
import { ScaleModes } from "phaser";

export interface Color {
    string: string,
    hex: number,
}

const DISPLAYED_PLAYERS = 8;

export default class ScoreboardWidget {

    //region public members
    public ranks: Phaser.GameObjects.BitmapText[] = [];
    public names: Phaser.GameObjects.BitmapText[] = [];
    public scores: Phaser.GameObjects.BitmapText[] = [];
    public dividers: Phaser.GameObjects.Graphics[] = [];
    
    get height(): number {
        if (this.ranks.length === 0) {
            return 0;
        }
        return this.ranks.length * (this._font.size + config.ui.spacing);
	}

	get width(): number {
		if (this.ranks.length === 0 || this.scores.length === 0) {
            return 0;
        }
        return this.scores[0].x - this.ranks[0].x;
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	set x(x: number) {
        this._x = x;
        this._adjustTextX();
        this._adjustDividerX();
	}

	set y(y: number) {
        this._y = y;
        this._adjustTextY();
        this._adjustDividerY();
	}
	//endregion

	//region public methods
	public update(localSocketId: String, players: MatchPlayer[]): void {
        this._localSocketId = localSocketId;
        this._updatePlayerText(players);
        this._updateDividers(players);
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number, font: Font = config.ui.fonts.scoreboard) {
        this._scene = scene;
        this._font = font;
        this._createTextObjects();
        this._createDividers();
        this.x = x;
        this.y = y;
	}
	//endregion

	//region private members
    private _scene: Phaser.Scene;
    private _x: number = 0;
    private _y: number = 0;
    private _font: Font;
    private _localSocketId: String;
	//endregion

    //region private methods
    private _createTextObjects(): void {
        for (let index = 0; index < DISPLAYED_PLAYERS; index++) {
            const bitmapTexts = [
                this._scene.add.bitmapText(0, 0, this._font.fontKey, '', this._font.size),
                this._scene.add.bitmapText(0, 0, this._font.fontKey, '', this._font.size),
                this._scene.add.bitmapText(0, 0, this._font.fontKey, '', this._font.size)
            ];

            bitmapTexts.forEach(b => {
                b.setScaleMode(ScaleModes.NEAREST);
            });
            
            this.ranks.push(bitmapTexts[0]);
            this.names.push(bitmapTexts[1]);
            this.scores.push(bitmapTexts[2]); 
        }
    }

    private _createDividers(): void {
        for (let index = 1; index < DISPLAYED_PLAYERS; index++) {
            this.dividers.push(this._scene.add.graphics());
        }
    }

    private _updateDividers(players: MatchPlayer[]): void {
        for (let index = 1; index < DISPLAYED_PLAYERS; index++) {
            if (index >= players.length) {
                this._clearDivider(index - 1);
                continue;
            }
            const currentPlayerRank = players[index].placement;
            const previousPlayerRank = players[index - 1].placement;
            const doubleLine = currentPlayerRank - previousPlayerRank > 1;
            const lineColor = players[index].scoreboardStatus === ScoreboardStatus.Endangered ? config.ui.colors.red.hex : config.ui.colors.white.hex;
            this._updateDivider(index - 1, lineColor, doubleLine);
        }
    }

    private _updateDivider(index: number, color: number, double: boolean = false): void {
        // Clear graphic
        this.dividers[index].clear();
        this.dividers[index].lineStyle(1, color, 0.4);
        this.dividers[index].lineBetween(-125, 0, 125, 0);

        if (double) {
            this.dividers[index].lineBetween(-125, 2, 125, 2);
        }
    }

    private _clearDivider(index: number): void {
        // Clear graphic
        this.dividers[index].clear();
    }

    private _updatePlayerText(players: MatchPlayer[]): void {
        for (let index = 0; index < DISPLAYED_PLAYERS; index++) {
            if (index >= players.length) {
                this.ranks[index].setText('');
                this.names[index].setText('');
                this.scores[index].setText('');
                continue;
            }
            this.ranks[index].setText(players[index].placement.toString());
            this.names[index].setText(players[index].displayName);
            this.scores[index].setText(players[index].points.toString());

            // Set text color
            if (players[index].playStatus === PlayStatus.Eliminated) {
                this._changeTextColor(index, config.ui.colors.grey);
            } else if (players[index].scoreboardStatus === ScoreboardStatus.Endangered) {
                this._changeTextColor(index, config.ui.colors.red);
            } else if (players[index].scoreboardStatus === ScoreboardStatus.Spotlighted) {
                this._changeTextColor(index, 'rainbow-text');
            } else if (players[index].socketId === this._localSocketId) {
                this._changeTextColor(index, config.ui.colors.yellow);
            } else {
                this._changeTextColor(index, config.ui.colors.white);
            }
        }
        this._adjustTextX();
    }

    private _changeTextColor(index: number, color: Color | string) {
        if (typeof color === 'string') {
            this.ranks[index].setPipeline(color);
            this.names[index].setPipeline(color);
            this.scores[index].setPipeline(color);
        } else {
            this.ranks[index].setTint(color.hex);
            this.names[index].setTint(color.hex);
            this.scores[index].setTint(color.hex);
        }
    }

    private _adjustTextX(): void {
        for (let index = 0; index < DISPLAYED_PLAYERS; index++) {
            this.ranks[index].x = this.x - 125 - this.ranks[index].width / 2;
            this.names[index].x = this.x - this.names[index].width / 2;
            this.scores[index].x = this.x + 125 - this.scores[index].width / 2;
        }
    }

    private _adjustTextY(): void {
        for (let index = 0; index < DISPLAYED_PLAYERS; index++) {
            this.ranks[index].y = this.y + index * (config.ui.spacing + this._font.size);
            this.names[index].y = this.y + index * (config.ui.spacing + this._font.size);
            this.scores[index].y = this.y + index * (config.ui.spacing + this._font.size);
        }
    }

    private _adjustDividerX(): void {
        for (const [index, divider] of this.dividers.entries()) {
            divider.x = this.x;
        }
    }

    private _adjustDividerY(): void {
        for (const [index, divider] of this.dividers.entries()) {
            divider.y = this.y + (index + 1) * (config.ui.spacing + this._font.size) - config.ui.spacing / 2;;
        }
    }
	//endregion
}
