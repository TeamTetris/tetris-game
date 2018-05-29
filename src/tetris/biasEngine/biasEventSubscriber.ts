
import { BiasEvent } from "./biasEvent"

export interface BiasEventSubscriber {
	receiveBiasEvent(biasEvent: BiasEvent);
}
