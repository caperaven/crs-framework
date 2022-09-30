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
        // menu is set on the instance because it has a ref attribute in the html
        // click has a binding on it and auto set on the instance.
        const event = instance.menu.performEvent("click");

        assertEquals(instance.menu.style.background, "red");
        assertEquals(event.actionsCalled.stopPropagation, true);
    })

    it("get element by id", async () => {
        const element = instance.querySelector("#main-menu");
        assert(element != null);
        assertEquals(element.id, "main-menu");
    })

    it("get element by attribute", async () => {
        const element = instance.querySelector('[data-id="menuItem1"]');
        assert(element != null);
        assertEquals(element.textContent, "Menu Item 1");
    })

    it("get element by class", async () => {
        const element = instance.querySelector('.green');
        assert(element != null);
        assertEquals(element.textContent, "Menu Item 2");
    })

    it("get element by tag name", async () => {
        const element = instance.querySelector("nav");
        assert(element != null);
        assertEquals(element.nodeName, "NAV");
    })

    it("select all li items", async () => {
        const result = instance.querySelectorAll("li");
        assertEquals(result.length, 3);
    })
})