
import BiasEventType from "tetris/biasEngine/biasEventType";
import BiasEvent from "tetris/biasEngine/biasEvent";

export default class BiasEventReceiver{

	//region public members
	public get filters(): BiasEventType[] {
		return this._eventFilters;
	}

	public set filters(filters: BiasEventType[]) {
		this._eventFilters = filters;
	}
	//endregion

	//region public methods
	public update(time: number, delta: number): void {
		// remove expired events
		this._events = this._events.filter((event) => event.endTime >= time);

		this._events.forEach((event) => {
			if (!this._eventFunctions.has(event.eventType)) {
				return;
			}

			this._eventFunctions[event.eventType](event);
		});
	}

	public receiveEvent(event: BiasEvent): void {
		if (!this._eventFilters.includes(event.eventType)) {
			return;
		}

		this._events = this._events.concat(event);
	}

	public addFilter(eventType: BiasEventType): BiasEventReceiver {
		if (!this._eventFilters.includes(eventType)) {
			this._eventFilters = this._eventFilters.concat(eventType);
		}

		return this;
	}

	public on(eventType: BiasEventType, callback: (BiasEvent) => void): BiasEventReceiver {
		this.addFilter(eventType);
		this._eventFunctions.set(eventType, callback);
		return this;
	}
	//endregion

	//region constructor
	public constructor() {
		this._eventFunctions = new Map<BiasEventType, (BiasEvent) => void>();
	}
	//endregion

	//region private members
	private _events: BiasEvent[] = [];
	private _eventFilters: BiasEventType[] = [];
	private _eventFunctions: Map<BiasEventType, (BiasEvent) => void>;
	//endregion

	//region private methods
	//endregion
}
