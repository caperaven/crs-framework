import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";
import {ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();

beforeAll(async () => {
    await import("../../../components/label-counter/label-counter.js");
})

describe ("label-counter", async () => {
    let instance;
    beforeEach(async () => {
        instance = document.createElement("label-counter");
        await instance.connectedCallback();
    })

    it ("init", async () => {
        assertEquals(instance.value, 1);
    })

    it ("change", async() => {
        assertEquals(instance.value, 1);
        const plusMock = new ElementMock("svg");
        const minusMock = new ElementMock("svg");

        plusMock.dataset.action = "increment";
        minusMock.dataset.action = "decrement";

        await instance.clickedHandler(new EventMock(plusMock));
        assertEquals(instance.value, 2);

        await instance.clickedHandler(new EventMock(minusMock));
        assertEquals(instance.value, 1);
    })
})