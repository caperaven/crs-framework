import {beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assertEquals, assert} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {ElementMock} from "../../mockups/element-mock.js";

await init();

beforeAll(async () => {
    await import("../../../components/options-toolbar/options-toolbar.js");
})

describe("options-toolbar tests", async () => {
    let instance;
    let button1;
    let button2;
    let marker;
    let parent;


    beforeEach(async () => {
        instance = document.createElement("options-toolbar");
        instance.bounds = {left: 0, top: 0, width: 40, height: 20};

        button1 = new ElementMock("button");
        button1.setAttribute("data-value", "on");
        button1.id = "on-button";
        button1.bounds = {left: 0, top: 0, width: 20, height: 20};

        instance.appendChild(button1);

        button2 = new ElementMock("button");
        button2.setAttribute("data-value", "off");
        button2.setAttribute("aria-selected", "true");
        button2.id = "off-button";
        button2.bounds = {left: 20, top: 0, width: 20, height: 20};

        instance.appendChild(button2);
        await instance.connectedCallback();

        const marker = instance.shadowRoot.querySelector(".marker");
        marker.bounds = {left: 0, top: 0, width: 20, height: 20};
        marker.id = "marker";

        const parent = instance.shadowRoot.querySelector(".parent");
        parent.bounds = {left: 0, top: 0, width: 40, height: 20};
        parent.id = "parent";
    });

    afterEach(async () => {
        await instance.disconnectedCallback();
    });

    it("instance is not null", async () => {
        assert(instance !== null);
        assert(instance.shadowRoot !== null);
        assert(marker !== null);
        assert(parent !== null);
    });

    it("click", async () => {
        assertEquals(button2.getAttribute("aria-selected"), "true");
        await instance.performEvent("click", button1);
        assertEquals(button2.getAttribute("aria-selected"), undefined);
        assertEquals(button1.getAttribute("aria-selected"), "true");

        await instance.performEvent("click", button2);
        assertEquals(button2.getAttribute("aria-selected"), "true");
        assertEquals(button1.getAttribute("aria-selected"), undefined);
    });

});