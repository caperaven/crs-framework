import { beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";
import {ElementMock} from "./../mockups/element-mock.js";
import {createMockChildren} from "./../mockups/child-mock-factory.js";

await init();

beforeAll(async () => {
    await import("./components/test-component.js");
})

describe("test framework tests", () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("test-component");
        instance.queryResults["nav"] = new ElementMock("nav", "nav");
        await instance.connectedCallback();

        createMockChildren(instance);
    })

    afterEach(async () => {
        instance = await instance.disconnectedCallback();
    })

    it ("initialized", async () => {
        const nav = instance.queryResults["nav"];
        assertEquals(nav.classList.contains("closed"), true);
    })

    it("get and set property", async () => {
        assertEquals(instance.getProperty("id"), "my-menu");
        instance.setProperty("id", "new name");
        assertEquals(instance.getProperty("id"), "new name");
    })

    it("perform event action", async () => {
        const event = instance.menu.performEvent("click");

        assertEquals(instance.menu.style.background, "red");
        assertEquals(event.actionsCalled.stopPropagation, true);
    })
})