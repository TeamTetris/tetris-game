import Profile from 'tetris/profiler/profile';
import { PROTOCOL_COMMAND_START, PROTOCOL_MESSAGE_KEYWORD} from 'tetris/profiler/webWorkerProtocol';

export default class Profiler {

	//region public members
	//endregion

	//region public methods
	public add(name: string) {
		const worker = this._createWorker(name);
		this._startWorker(worker);
		this._registerResponseHandler(worker);
	}
	//endregion

	//region constructor
	constructor(profile: Profile) {
		this._profile = profile;
	}
	//endregion

	//region private members
	private _workers: Worker[] = [];
	private _profile: Profile;
	//endregion

	//region private methods
	private _createWorker(name: string): Worker {
		const worker = new Worker(name + '.js');
		this._workers.push(worker);
		return worker;
	}

	private _startWorker(worker: Worker): void {
		worker.postMessage(PROTOCOL_COMMAND_START);
	}

	private _registerResponseHandler(worker: Worker) {
		worker.addEventListener(PROTOCOL_MESSAGE_KEYWORD, this._handleWorkerResponse);
	}

	private _handleWorkerResponse(event: MessageEvent) {
		this._profile.add(name, event.data);
	}

	//endregion
}
