import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";
import {createChildrenFromHtml} from "../../mockups/child-mock-factory.js";


await init();

beforeAll(async () => {
    await import("../../../components/filter-header/filter-header.js");
})

describe ("filter-header tests", async () => {
    let instance;
    let parent;
    let ul;

    beforeEach(async () => {
        parent = new ElementMock("div");
        parent.id = "parent";
        ul = new ElementMock("ul");
        parent.appendChild(ul);

        instance = document.createElement("filter-header");
        instance.setAttribute("for", "ul");
        parent.appendChild(instance);

        await instance.connectedCallback();

        createChildrenFromHtml(ul, [
            '<li data-tags="add">Add</li>',
            '<li data-tags="remove">Remove</li>',
            '<li data-tags="update">Update</li>',
            '<li data-tags="save">Save</li>'
        ].join(" "));

    });

    afterEach(async () => {
        await instance.disconnectedCallback();
    });

    it("check elements exist", async () => {
        assert(instance !== null);
        assert(parent !== null);
        assert(ul !== null);

        assertEquals(instance.parentElement, parent);
        assertEquals(instance.getAttribute("for"), "ul");
    });

    it("check input change", async () => {

        for(let i = 0; i < ul.children.length; i++){
            console.log(ul.children[i].getAttribute("data-tags"));
        }

        const input = instance.shadowRoot.querySelector("input");
        assert(input !== null);
        input.value = "a";
        await input.performEvent("keyup", input);

        for(let i = 0; i < ul.children.length; i++){
            console.log(ul.children[i].getAttribute("aria-hidden"));
        }

        input.value = "";
        await input.performEvent("keyup", input);

        for(let i = 0; i < ul.children.length; i++){
            console.log(ul.children[i].getAttribute("aria-hidden"));
        }

        input.value = "add";
        await input.performEvent("keyup", input);

        for(let i = 0; i < ul.children.length; i++){
            console.log(ul.children[i].getAttribute("aria-hidden"));
        }
    });


});