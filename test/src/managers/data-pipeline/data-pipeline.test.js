import {DataPipeline} from "./../../../../src/managers/data-pipeline/data-pipeline.js";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";

Deno.test("DataPipeline - simple activate", () => {
    let called = false;
    const pipeline = new DataPipeline();
    pipeline.addIntent(() => called = true);
    pipeline.addPropertySlot("name");
    pipeline.setPropertyValue("name", "test");

    assertEquals(called, false);
    pipeline.activate();
    assertEquals(called, true);
    assertEquals(pipeline.slots, null);
})

Deno.test("DataPipeline - streaming", () => {
    let result =  null;
    const pipeline = new DataPipeline((slots) => result = slots, true);
    pipeline.addPropertySlot("firstName");
    pipeline.addPropertySlot("lastName")
    pipeline.activate();

    assertEquals(result, {firstName: null, lastName: null});
    pipeline.setPropertyValue("firstName", "test");
    assertEquals(result, {firstName: "test", lastName: null});

    pipeline.setPropertyValue("lastName", "test2");
    assertEquals(result, {firstName: "test", lastName: "test2"});

    pipeline.dispose();
})

Deno.test("DataPipeline - simple null sequence checks for callbacks", () => {
    let called = false;
    let result = null;

    const pipeline = new DataPipeline();
    pipeline.addIntent((slots) => {
        called = true;
        result = slots;
    });
    pipeline.addPropertySlot("firstName");
    pipeline.addPropertySlot("lastName");
    pipeline.activate();

    assertEquals(called, false);
    pipeline.setPropertyValue("firstName", "test");
    assertEquals(called, false);
    pipeline.setPropertyValue("lastName", "test2");
    assertEquals(called, true);
    assertEquals(result.firstName, "test");
    assertEquals(result.lastName, "test2")
})

Deno.test("DataPipeline - promise slot", async () => {
    let called = false;
    let resolvePromise = null

    const pipeline = new DataPipeline();
    pipeline.addIntent(() => called = true);
    pipeline.addPromiseSlot("name", new Promise(resolve => {resolvePromise = resolve}));
    pipeline.activate();
    assertEquals(called, false);

    await resolvePromise("test");
    assertEquals(called, true);
});

Deno.test("DataPipeline - event listener slot", () => {
    class TestEvent extends EventTarget {
        execute() {
            this.dispatchEvent(new CustomEvent("test", {detail: "test"}));
        }
    }

    let called = false;
    const instance = new TestEvent();
    const pipeline = new DataPipeline();
    pipeline.addIntent(() => called = true);
    pipeline.addEventListenerSlot("name", instance, "test");
    pipeline.activate();
    assertEquals(called, false);

    instance.execute();
    assertEquals(called, true);
})

class MockElement {
    constructor() {
        this.attributes = {};
        this.listeners = {};
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
        if (this.listeners[name]) {
            this.listeners[name].forEach(callback => callback({ type: 'attributes', attributeName: name }));
        }
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    removeEventListener(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
}

class MockMutationObserver {
    constructor(callback) {
        this.callback = callback;
        this.elements = [];
    }

    observe(element, options) {
        this.elements.push(element);
    }

    disconnect() {
        this.elements = [];
    }

    trigger(mutations) {
        this.callback(mutations);
    }
}
