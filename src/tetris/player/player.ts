import Field from 'tetris/field/field';

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
		this._field.activeBrick.moveLeft();
	}

	protected moveRight(): void {
		this._field.activeBrick.moveRight();
	}

	protected moveDown(): void {
		this._field.activeBrick.moveDown();
	}

	protected drop(): void {
		this._field.activeBrick.drop();
	}

	protected rotate(): void {
		this._field.activeBrick.rotate();
	}
	//endregion
}