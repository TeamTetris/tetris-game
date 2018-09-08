import BrickType from "tetris/brick/brickType";
import Skin from "tetris/brick/skin";
import { SkinRarity } from "tetris/brick/skinRarity";
import Brick from "tetris/brick/brick";

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

        for (let brickType = 0; brickType < Object.keys(BrickType).length / 2; brickType++) {
            const brickSkins = [];
            for (let s = 0; s < this.skinNameBases.length; s++) {
                for (let i = 1; i <= this.skinAmountPerSkinSet; i++) {
                    const rarity = Math.floor(s / 3);
                    const skinName = [this.skinNameBases[s], i].join(' ');
                    const frameName = this.skinNameBases[s] + '_0' + i;
                    brickSkins.push(new Skin(frameName, rarity, brickType, skinName, brickSkins.length));
                }
            }
            this.skins.set(brickType, brickSkins);
            this.equippedSkins.set(brickType, brickSkins[brickType % this.skinAmountPerSkinSet]);
        }
    }
	//endregion

    //region private members
    private readonly skins: Map<BrickType, Array<Skin>>;
    private readonly equippedSkins: Map<BrickType, Skin>;
    private readonly skinNameBases: Array<string> = [
        /* common */ "colorful", "bw", "sepia", 
        /* rare */ "aqua", "light", "purple", 
        /* epic*/ "flat", "glitch", "shiny", 
        /* legendary*/ "dotted", "relief", "retro"
    ];
    private readonly skinAmountPerSkinSet: number = 6;
	//endregion

    //region private methods
	//endregion
}