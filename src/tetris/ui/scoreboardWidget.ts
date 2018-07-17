/// <reference path="../../../definitions/phaser.d.ts"/>

import config from "tetris/config";
import MatchPlayer from "tetris/interfaces/MatchPlayer";

export interface Font {
    size: number,
    font: {},
}

export default class ScoreboardWidget {

    //region public members
    public ranks: Phaser.GameObjects.Text[] = [];
    public names: Phaser.GameObjects.Text[] = [];
    public scores: Phaser.GameObjects.Text[] = [];
	public dividers: Phaser.GameObjects.Graphics[] = [];
	//endregion

	//region public methods
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
        const offset = x - this._x;
        for (let index = 0; index < this.ranks.length; index++) {
            this.ranks[index].x += offset;
            this.names[index].x += offset;
            this.scores[index].x += offset;
        }
        for (const divider of this.dividers) {
            divider.x += offset;
        }
        this._x = x;
	}

	set y(y: number) {
        const offset = y - this._y;
		for (let index = 0; index < this.ranks.length; index++) {
            this.ranks[index].y += offset;
            this.names[index].y += offset;
            this.scores[index].y += offset;
        }
        for (const divider of this.dividers) {
            divider.y += offset;
        }
        this._y = y;
	}

	public update(playerScores: MatchPlayer[]): void {
		this._clearScoreboard();

		for (const [index, player] of playerScores.entries()) {
            
            this._createPlayerText(index, player);

			if (index > 0) {
                const currentPlayerRank = parseInt(player.rank, 10);
                const previousPlayerRank = parseInt(playerScores[index - 1].rank, 10);
                const doubleLine = currentPlayerRank - previousPlayerRank > 1;
                const lineColor = player.danger ? config.ui.colors.red.hex : config.ui.colors.white.hex;
                this._createDivider(index, lineColor, doubleLine);
            }
		}
	}
	//endregion

	//region constructor
	public constructor(scene: Phaser.Scene, x: number, y: number, font: Font = config.ui.fonts.scoreboard) {
        this._scene = scene;
		this.x = x;
        this.y = y;
        this._font = font;
	}
	//endregion

	//region private members
    private _scene: Phaser.Scene;
    private _x: number = 0;
    private _y: number = 0;
    private _font: Font;
	//endregion

    //region private methods
    private _clearScoreboard(): void {
        for (let index = 0; index < this.ranks.length; index++) {
            this.ranks[index].destroy();
            this.names[index].destroy();
            this.scores[index].destroy();
        }
        this.ranks.splice(0, this.ranks.length - 1);
        this.names.splice(0, this.names.length - 1);
        this.scores.splice(0, this.scores.length - 1);
    }

    private _createPlayerText(index: number, player: MatchPlayer): void {
        // Add rank text
        const rank = this._scene.add.text(0, 0, player.rank, this._font.font);
        rank.x = this.x - 125 - rank.width / 2;
        rank.y = this.y + index * (config.ui.spacing + this._font.size);

        // Add name text
        const name = this._scene.add.text(0, 0, player.name, this._font.font);
        name.x = this.x - name.width / 2;
        name.y = this.y + index * (config.ui.spacing + this._font.size);

        // Add score text
        const score = this._scene.add.text(0, 0, player.score, this._font.font);
        score.x = this.x + 125 - score.width / 2;
        score.y = this.y + index * (config.ui.spacing + this._font.size);

        // Set text color
        if (player.danger) {
            rank.setColor(config.ui.colors.red.string);
            name.setColor(config.ui.colors.red.string);
            score.setColor(config.ui.colors.red.string);
        } else if (player.rank === '1') {
            rank.setPipeline('rainbow-text');
            name.setPipeline('rainbow-text');
            score.setPipeline('rainbow-text');
            // TODO: Compare username
        }else if (player.name === "You") {
            rank.setColor(config.ui.colors.yellow.string);
            name.setColor(config.ui.colors.yellow.string);
            score.setColor(config.ui.colors.yellow.string);
        }
    }

    private _createDivider(index: number, color: number, double: boolean = false): void {
        // Create graphic
        const divider = this._scene.add.graphics();
        const dividerY = this.y + index * (config.ui.spacing + this._font.size) - config.ui.spacing / 2;
        divider.lineStyle(1, color, 0.4);
        divider.lineBetween(this.x - 125, dividerY, this.x + 125, dividerY);

        if (double) {
            divider.lineBetween(this.x - 125, dividerY + 2, this.x + 125, dividerY + 2);
        }
    }
	//endregion
}
