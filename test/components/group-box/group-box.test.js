import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();

beforeAll(async () => {
    await import("../../../components/group-box/group-box.js");
})

describe ("group box tests", async () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("group-box");
        await instance.connectedCallback();
    })

    afterEach(async () => {
        await instance.disconnectedCallback();
    })

    it("instance is not null", async () => {
        assert(instance !== null);
        assertEquals(instance.getAttribute("aria-expanded"), "true");
    });

    it("expand and collapse on click", async () => {
        const btnToggleExpandMock = new ElementMock("button");
        btnToggleExpandMock.id = "btnToggleExpand";

        await instance.performEvent("click", btnToggleExpandMock);
        assertEquals(instance.getAttribute("aria-expanded"), "false");

        await instance.performEvent("click", btnToggleExpandMock);
        assertEquals(instance.getAttribute("aria-expanded"), "true");
    })

    it("check for header content", async () => {
        instance.dataset.title = "test title";
        assertEquals(instance.dataset.title, "test title");
        assertEquals(instance.getAttribute("aria-expanded"), "true");

    });

    it("keypress to expand and collapse", async () => {
        const header = instance.shadowRoot.querySelector("header");
        assert(header !== null);

        await header.performEvent("keyup", header,{key: "ArrowUp"});
        assertEquals(instance.getAttribute("aria-expanded"), "false");

        await header.performEvent("keyup", header,{key: "ArrowDown"});
        assertEquals(instance.getAttribute("aria-expanded"), "true");
    })
});