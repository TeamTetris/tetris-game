import Field from '../field/field';

export default abstract class Player {

	private _field: Field;

	protected constructor(field: Field) {
		this._field = field;
	}

	update(time: number, delta: number) {

	}
}