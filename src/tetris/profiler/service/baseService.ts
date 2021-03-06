import BaseMeasurement from "tetris/profiler/measurement/baseMeasurement";

export default abstract class BaseService {

	//region public members
	public get name(): string {
		return this._name;
	}

	public get hasBeenStarted(): boolean {
		return this._hasBeenStarted;
	}
	//endregion

	//region public methods
	public async run(successCallback: (
		senderName: string,
		measurement: BaseMeasurement) => void): Promise<void> {
		if (!this._preRun()) {
			return;
		}
		this._hasBeenStarted = true;
		await this._run(successCallback);
	}
	//endregion

	//region constructor
	protected constructor(name: string, errorCallback: (senderName: string, error: Error) => void) {
		this._name = name;
		this._errorCallback = errorCallback;
		this._hasBeenStarted = false;
	}
	//endregion

	//region private members
	private readonly _name: string;
	private _running: boolean;
	private _hasBeenStarted: boolean;
	protected readonly _errorCallback: (senderName: string, error: Error) => void;
	//endregion

	//region private methods
	private _preRun(): boolean {
		if (this._running) {
			return false;
		}
		this._running = true;
		return true;
	}
	//endregion

	//region protected methods
	protected abstract async _run(successCallback: (
		senderName: string,
		measurement: BaseMeasurement) => void): Promise<void>;

	protected _postRun(): void {
		this._running = false;
	}
	//endregion
}