import BrickType from "tetris/brick/brickType";
import Skin from "tetris/brick/skin";
import { SkinRarity } from "tetris/brick/skinRarity";

export default class SkinStorage {
    //region public members
    public get skinAmount(): number {
        return this.skins.get(0).length; // skin amount for a single brick
    }
	//endregion

    //region public methods
    public getSkin(brickType: BrickType, skinIndex: number): Skin {
        return this.skins.get(brickType)[skinIndex];
    }

    public getEquippedSkin(brickType: BrickType): Skin {
        return this.equippedSkins.get(brickType);
    }
    
    public equipSkin(brickType: BrickType, skin: Skin): void {
        this.equippedSkins.set(brickType, skin);
    }
	//endregion

    //region constructor
    public constructor() {
        this.skins = new Map<BrickType, Array<Skin>>();
        this.equippedSkins = new Map<BrickType, Skin>();
        const skinNameBases = ["colorful", "bw", "sepia", /* rare */ "aqua", "light", "purple", /* epic*/ "flat", "glitch", "shiny", /* legendary*/ "dotted", "relief", "retro",];

        for (let brickType = 0; brickType < 7; brickType++) {
            const brickSkins = [];
            for (let s = 0; s < skinNameBases.length; s++) {
                for (let i = 1; i < 7; i++) {
                    const rarity = Math.floor(s / 3);
                    const name = [skinNameBases[s], i].join(' ');
                    brickSkins.push(new Skin(skinNameBases[s] + '_0' + i, rarity, brickType, name, brickSkins.length));
                }
            }
            this.skins.set(brickType, brickSkins);
            this.equippedSkins.set(brickType, brickSkins[0]);
        }
    }
	//endregion

    //region private members
    private skins: Map<BrickType, Array<Skin>>;
    private equippedSkins: Map<BrickType, Skin>;
	//endregion

	//region private methods
	//endregion
}