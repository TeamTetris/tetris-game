import Field from '../field/field';

export default abstract class Player {

	//region public members
	//endregion

	//region public methods
	public abstract update(time: number, delta: number): void;
	//endregion

	//region constructor
	protected constructor(field: Field) {
		this._field = field;
	}
	//endregion

	//region private members
	private _field: Field;
	//endregion

	//region private methods
	//endregion

	//region protected methods
	protected moveLeft(): void {
		this._field.moveBrickLeft();
	}

	protected moveRight(): void {
		this._field.moveBrickRight();
	}

	protected moveDown(): void {
		this._field.moveBrickDown();
	}

	protected drop(): void {
		this._field.dropBrick();
	}
	//endregion
}