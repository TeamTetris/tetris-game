import { LootboxType } from "tetris/lootbox/lootboxType";

export default class LootboxStorage {
    //region public members
	  //endregion

    //region public methods
    public modifyAmount(lootboxType: LootboxType, amount: number): void {
      this._lootboxAmounts.set(lootboxType, this._lootboxAmounts.get(lootboxType) + amount);
    }
    
    public getAmount(lootboxType: LootboxType): number {
      return this._lootboxAmounts.get(lootboxType);
    }
	  //endregion

    //region constructor
	  //endregion

    //region private members
    private _lootboxAmounts: Map<LootboxType, number> = new Map([
      [LootboxType.Bronze, 3],
      [LootboxType.Silver, 0],
      [LootboxType.Gold, 0],
      [LootboxType.Diamond, 0],
      [LootboxType.Cyber, 0],
    ]);	  
    //endregion

    //region private methods
	  //endregion
}