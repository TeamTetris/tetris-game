import { SkinRarity } from "tetris/brick/skinRarity";
import BrickType from "tetris/brick/brickType";
import Brick from "tetris/brick/brick";

export default class Skin {
    private _frameName: string;
    private _rarity: SkinRarity;
    private _brickType: BrickType;
    private _unlocked: boolean = false;
    private _name: string;
    private _id: number;

    public constructor(frameName: string, rarity: SkinRarity, brickType: BrickType, name: string, id: number) {
		this._frameName = frameName;
        this._rarity = rarity;
        this._brickType = brickType;
        this._name = name;
        this._id = id;
    }
    
    public unlock() {
        this._unlocked = true;
    }

    public get isUnlocked(): boolean {
        return this._unlocked;
    }

    public get frameName(): string {
        return this._frameName;
    }

    public get id(): number {
        return this._id;
    }
}