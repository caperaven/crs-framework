export class DataPipeline {
    #slots = {};
    #events = {};
    #intents = [];
    #streaming = false;
    #autoDispose = false;
    #isActive = false;
    #mutationObserver;

    evaluateSlots = this.#evaluateSlots.bind(this);

    get slots() {
        return this.#slots;
    }

    constructor(intentCallback, streaming = false, autoDispose = true) {
        this.#streaming = streaming;
        this.#autoDispose = autoDispose;

        if (streaming === true) {
            this.#autoDispose = false;
        }

        if (intentCallback != null) {
            this.#intents.push(intentCallback);
        }
    }

    dispose() {
        this.evaluateSlots = null

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
        this.#events = null;
    }

    #performIntent() {
        for (const intent of this.#intents) {
            intent(this.#slots);
        }

        if (this.#autoDispose === true) {
            this.dispose();
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
        pipeline.evaluateSlots();
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
        this.#slots[slotName] = null;

        promise.then(value => {
            this.#slots[slotName] = value;
            this.#evaluateSlots();
        });
    }

    addAttributeSlot(slotName, element, attributeName) {
        this.#slots[attributeName] = null;

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

        this.#mutationObserver.observe(element, { attributes: true });
    }

    addEventListenerSlot(slotName, eventSource, eventName) {
        this.#slots[slotName] = null;
        const callback = this.#handleEvents.bind({ pipeline: this, slotName })

        this.#events[slotName] = {
            eventSource,
            eventName,
            callback
        }

        eventSource.addEventListener(eventName, callback);
    }

    removeEventListener(slotName) {
        const eventDetails = this.#events[slotName];
        eventDetails.eventSource.removeEventListener(eventDetails.eventName, eventDetails.callback);

        eventDetails.eventSource = null;
        eventDetails.eventName = null;
        eventDetails.callback = null;
        delete this.#events[slotName];
    }
}