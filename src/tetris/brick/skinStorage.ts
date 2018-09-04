import BrickType from "tetris/brick/brickType";
import Skin from "tetris/brick/skin";
import { SkinRarity } from "tetris/brick/skinRarity";

export default class SkinStorage {
    private skins: Map<BrickType, Array<Skin>>;
    private equippedSkins: Map<BrickType, Skin>;
    public skinAmount: number;

    public constructor() {
        this.skins = new Map<BrickType, Array<Skin>>();
        this.equippedSkins = new Map<BrickType, Skin>();
        const skinNameBases = ["colorful", "bw", "sepia", /* rare */ "aqua", "light", "purple", /* epic*/ "flat", "glitch", "shiny", /* legendary*/ "dotted", "relief", "retro",];

        for (let brickType = 0; brickType < 7; brickType++) {
            const brickSkins = [];
            for (let s = 0; s < skinNameBases.length; s++) {
                for (let i = 1; i < 7; i++) {
                    const rarity = s % 3;
                    const name = [skinNameBases[s], BrickType[brickType], i].join(' ');
                    brickSkins.push(new Skin(skinNameBases[s] + '_0' + i, rarity, brickType, name, brickSkins.length));
                }
            }
            this.skins.set(brickType, brickSkins);
            this.equippedSkins.set(brickType, brickSkins[0]);
        }
        this.skinAmount = skinNameBases.length * 6;
    }
    
    public getSkin(brickType: BrickType, skinIndex: number): Skin {
        return this.skins.get(brickType)[skinIndex];
    }

    public getEquippedSkin(brickType: BrickType): Skin {
        return this.equippedSkins.get(brickType);
    }
    
    public equipSkin(brickType: BrickType, skin: Skin): void {
        this.equippedSkins.set(brickType, skin);
    }
}