import Vector2 = Phaser.Math.Vector2;

export default class BrickBias {
	private _chances: number[];
	private _position: Vector2;

	public get chances(): number[] {
		return this._chances;
	}

	public set chances(chances: number[]) {
		this._chances = chances;
	}

	public get position(): Vector2 {
		return this._position;
	}

	public set position(position: Vector2) {
		this._position = position;
	}
}