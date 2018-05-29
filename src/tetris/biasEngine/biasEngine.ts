/// <reference path="../../../definitions/phaser.d.ts"/>

/** import { Brick } from "./brick/brick"; */
import { BiasEvent } from "./biasEvent"
import { BiasEventType } from "./biasEventType";
import { BiasEventSubscriber } from "./biasEventSubscriber"

export class BiasEngine {
    private static POSSIBLE_EVENTS: BiasEventType[];
    private lastBiasEvent: number = 0;
    private biasEventInterval : number = 1000;
    private biasEventSubscribers: BiasEventSubscriber[];
    /** private profiler: Profiler;*/

    constructor(/** TODO: profiler: Profiler */) {
        /** this.profiler = profiler; */
    }

    /**getNewBrickBias(field: Field): BrickBias {
        // TODO: generate new brick bias
    }*/

    private spawnBiasEvent(): void {
        
    }

    update(time: number, delta: number): void {
        if (time > this.lastBiasEvent + this.biasEventInterval) {
            this.lastBiasEvent = time;
            this.spawnBiasEvent();
        }
    }     
    
    subscribeForBiasEvents(biasEventSubscriber: BiasEventSubscriber): void {
        this.biasEventSubscribers.push(biasEventSubscriber);
    }
}
