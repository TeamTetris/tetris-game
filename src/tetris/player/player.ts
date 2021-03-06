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
	private _lastMoveDown: number = new Date().valueOf();
	private readonly _moveDownInterval: number = 50;
	//endregion

	//region private methods
	//endregion

	//region protected methods
	protected moveLeft(): void {
		if (!this._field.activeBrick) {
			return;
		}

		this._field.activeBrick.moveLeft();
	}

	protected moveRight(): void {
		if (!this._field.activeBrick) {
			return;
		}

		this._field.activeBrick.moveRight();
	}

	protected moveDown(): void {
		if (!this._field.activeBrick) {
			return;
		}

		const moveDown = this._lastMoveDown + this._moveDownInterval < new Date().valueOf();
		if (moveDown && this._field.activeBrick.moveDown()) {
			this._lastMoveDown = this._lastMoveDown + this._moveDownInterval;
			this._field.addMoveBonusPoints();
		}
	}

	protected dropToFloor(): void {
		if (!this._field.activeBrick) {
			return;
		}

		const droppedRows = this._field.activeBrick.dropToFloor();
		this._field.addMoveBonusPoints(droppedRows);
	}

	protected rotate(): void {
		if (!this._field.activeBrick) {
			return;
		}
		
		this._field.activeBrick.rotate();
	}
	//endregion
}