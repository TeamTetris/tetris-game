
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
		this._removeExpiredEvents(time);
		this._triggerEventCallbacks();
	}

	public receiveEvent(event: BiasEvent): void {
		if (!this._eventFilters.includes(event.eventType)) {
			return;
		}

		this._events.set(event.eventType, event);
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

	public has(eventType: BiasEventType): boolean {
		return this._events.has(eventType);
	}

	public get(eventType: BiasEventType): BiasEvent {
		if (!this._events.has(eventType)) {
			return null;
		}

		return this._events[eventType];
	}
	//endregion

	//region constructor
	public constructor() {
		this._events = new Map<BiasEventType, BiasEvent>();
		this._eventFunctions = new Map<BiasEventType, (BiasEvent) => void>();
	}
	//endregion

	//region private members
	private readonly _events: Map<BiasEventType, BiasEvent>;
	private _eventFilters: BiasEventType[] = [];
	private readonly _eventFunctions: Map<BiasEventType, (BiasEvent) => void>;
	//endregion

	//region private methods
	private _removeExpiredEvents(time: number): void {
		for (let i = 0; i < this._events.size; ) {
			const key = this._events.keys()[i];

			if (this._events[key].endTime >= time) {
				i++;
				continue;
			}

			this._events.delete(key);
		}
	}

	private _triggerEventCallbacks(): void {
		this._events.forEach((event: BiasEvent, eventType: BiasEventType) => {
			if (!this._eventFunctions.has(eventType)) {
				return;
			}

			this._eventFunctions[eventType](event);
		});
	}
	//endregion
}
