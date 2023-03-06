import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {init} from "../../mockups/init.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();

beforeAll(async () => {
    await import("../../../components/check-list/check-list.js");
})

describe ("two-state checklist tests", async () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("check-list");
        await instance.connectedCallback();
    });

    afterEach(async () => {
        await instance.disconnectedCallback();
    })

    it("instance is not null", async () => {
        assert(instance);
        // assertEquals(instance.getAttribute("aria-expanded"), "false");
        // assertEquals(instance.shadowRoot.querySelector("#btnDropdown").getAttribute("aria-expanded"), "false");
    })
})