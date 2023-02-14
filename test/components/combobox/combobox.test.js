import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {init} from "./../../../test/mockups/init.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();

beforeAll(async () => {
    await import("../../../components/combobox/combobox.js");
})

describe ("combobox tests", async () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("combo-box");

        const loadFn = instance.load;
        instance.load = async () => {
            createMockChildren(instance);
            await loadFn();
        };

        await instance.connectedCallback();
    });

    afterEach(async () => {
        await instance.disconnectedCallback();
    })

    it("instance is not null", async () => {
        assert(instance);
        assertEquals(instance.getAttribute("aria-expanded"), "false");
        assertEquals(instance.shadowRoot.querySelector("#btnDropdown").getAttribute("aria-expanded"), "false");
    })

    it ("click on element toggles expanded state", async () => {
        const btnToggleExpandMock = new ElementMock("button");
        btnToggleExpandMock.id = "btnDropdown";

        instance.clickHandler(new EventMock(btnToggleExpandMock));
        assertEquals(instance.getAttribute("aria-expanded"), "true");

        instance.clickHandler(new EventMock(btnToggleExpandMock));
        assertEquals(instance.getAttribute("aria-expanded"), "false");
    });
})