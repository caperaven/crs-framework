import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";
import {createChildrenFromHtml} from "../../mockups/child-mock-factory.js";

await init();

beforeAll(async () => {
    await import("../../../components/options-toolbar/options-toolbar.js");
})

describe ("options-toolbar tests", async () => {
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

        // console.log(instance.shadowRoot.querySelector(".marker").tagName);

        const marker = instance.shadowRoot.querySelector(".marker");
        marker.bounds = {left: 0, top: 0, width: 20, height: 20};
        marker.id = "marker";
        //
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
        // assert(instance.shadowRoot.querySelector(".marker") !== null);
        // assert(instance.shadowRoot.querySelector(".parent") !== null);
        assert(marker !== null);
        assert(parent !== null);
    });

    it("click", async () => {
        console.log("button1", button1.id);
        console.log("button2", button2.id);
        console.log(instance.shadowRoot.querySelector(".marker").id);
        console.log(instance.shadowRoot.querySelector(".parent").id);
        console.log(button2.getAttribute("aria-selected"));
        await instance.performEvent("click", button1);
        console.log(button2.getAttribute("aria-selected"));
        console.log(button1.getAttribute("aria-selected"));
    });


});