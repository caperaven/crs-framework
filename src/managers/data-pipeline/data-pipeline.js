export class DataPipeline {
    #slots = {};
    #events = {};
    #intents = [];
    #streaming = false;
    #autoDispose = false;
    #isActive = false;
    #mutationObserver;
    #handleEventsHandler = this.#handleEvents.bind(this);

    get slots() {
        return this.#slots;
    }

    constructor(intentCallback, streaming = false, autoDispose = false) {
        this.#streaming = streaming;
        this.#autoDispose = autoDispose;

        if (intentCallback != null) {
            this.#intents.push(intentCallback);
        }
    }

    dispose() {
        this.#slots = null;
        this.#streaming = null;
        this.#autoDispose = null;

        if (this.#mutationObserver != null) {
            this.#mutationObserver.disconnect();
            this.#mutationObserver = null;
        }

        const slotNames = Object.keys(this.#events);
        for (const slotName of slotNames) {
            this.removeEventListener(slotName);
        }
    }

    #performIntent() {
        for (const intent of this.#intents) {
            intent(this.#slots);
        }
    }

    /**
     * Evaluate all slots and perform the intent if all slots are set.
     * If streaming is enabled, the intent will be performed whenever a slot is set.
     */
    #evaluateSlots() {
        if (this.#isActive !== true) {
            return;
        }

        if (this.#streaming === true) {
            return this.#performIntent();
        }

        for (let slotName in this.#slots) {
            if (this.#slots[slotName] === null) {
                return;
            }
        }

        this.#performIntent();
    }

    #handleEvents(event) {
        const pipeline = this.pipeline;
        const slotName = this.slotName;

        pipeline.slots[slotName] = event.detail;
    }

    activate() {
        this.#isActive = true;
        this.#evaluateSlots();
    }

    addIntent(callback) {
        this.#intents.push(callback);
    }

    removeIntent(callback) {
        const index = this.#intents.indexOf(callback);

        if (index > -1) {
            this.#intents.splice(index, 1);
        }
    }

    /**
     * Register a property slot that can be set using setPropertyValue.
     * @param slotName
     * @returns {DataPipeline}
     */
    addPropertySlot(slotName) {
        this.#slots[slotName] = null;
        return this;
    }

    setPropertyValue(slotName, value) {
        this.#slots[slotName] = value;
        this.#evaluateSlots();
    }

    addPromiseSlot(slotName, promise) {
        promise.then(value => {
            this.#slots[slotName] = value;
            this.#evaluateSlots();
        });
    }

    addAttributeSlot(slotName, element, attributeName) {
        if (this.#mutationObserver == null) {
            this.#mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes') {
                        if (this.#slots.hasOwnProperty(mutation.attributeName)) {
                            this.#slots[mutation.attributeName] = element.getAttribute(mutation.attributeName);
                            this.#evaluateSlots();
                        }
                    }
                });
            });
        }
    }

    addEventListenerSlot(slotName, eventSource, eventName) {
        const callback = this.#handleEvents.bind({ pipeline: this, slotName })

        this.#events[slotName] = {
            eventSource,
            eventName,
            callback
        }

        eventSource.addEventListener(eventName, this.#handleEventsHandler);
    }

    removeEventListener(slotName) {
        const eventDetails = this.#events[slotName];
        eventDetails.eventSource.addEventListenerSlot(eventDetails.eventName, eventDetails.callback);

        eventDetails.eventSource = null;
        eventDetails.eventName = null;
        eventDetails.callback = null;
        delete this.#events[slotName];
    }
}