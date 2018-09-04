import { SkinRarity } from "tetris/brick/skinRarity";
import BrickType from "tetris/brick/brickType";
import Brick from "tetris/brick/brick";

export default class Skin {
    //region public members
    public get isUnlocked(): boolean {
        return this._unlocked;
    }

    public get frameName(): string {
        return this._frameName;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get rarity(): SkinRarity {
        return this._rarity;
    }
	//endregion

    //region public methods
    public unlock() {
        this._unlocked = true;
    }
	//endregion

    //region constructor
    public constructor(frameName: string, rarity: SkinRarity, brickType: BrickType, name: string, id: number) {
		this._frameName = frameName;
        this._rarity = rarity;
        this._brickType = brickType;
        this._name = name;
        this._id = id;
    }
	//endregion

    //region private members
    private _frameName: string;
    private _rarity: SkinRarity;
    private _brickType: BrickType;
    private _unlocked: boolean = false;
    private _name: string;
    private _id: number;
	//endregion

	//region private methods
	//endregion
}