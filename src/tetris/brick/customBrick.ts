
import Vector2 = Phaser.Math.Vector2;
import BrickFactory from "tetris/brick/brickFactory";
import BrickType from "tetris/brick/brickType";
import Brick from "tetris/brick/brick";

export default class CustomBrick {

	//region public members
	//endregion

  //region public methods
  public setFrameName(frameName: string): void {
    this._brick.blocks.forEach(b => b.spriteFrameName = frameName);
  }

  public destroy(): void {
    this._brick.destroy();
  }

  public setSpriteDepth(depth: number): void {
    this._brick.blocks.forEach(b => b.sprite.setDepth(depth));
  }
	//endregion

  //region constructor
  public constructor(scene: Phaser.Scene, brickType: BrickType, frameName: string, x: number, y: number) {
    this._brick = new BrickFactory(scene, null, null).newCustomBrick(brickType, CustomBrick.blockOffsets[brickType]);
    this._brick.blocks.forEach(b => b.spriteFrameName = frameName);
    this._brick.preDraw(new Vector2(x, y));
  }
	//endregion

  //region private members
  private static readonly blockOffsets = [
    new Vector2(-0.5, 0), 
    new Vector2(-1, -1), 
    new Vector2(-1, -0.5), 
    new Vector2(0, -0.5), 
    new Vector2(-1.5, -1), 
    new Vector2(-1.5, -1), 
    new Vector2(-1.5, -1) 
  ];
  private _brick: Brick;
	//endregion

	//region private methods
	//endregion
}





