import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";


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


    });

    afterEach(async () => {
        await instance.disconnectedCallback();
    });

    it("check elements exist", async () => {
        assert(instance !== null);
        assert(parent !== null);
        assert(ul !== null);

        assertEquals(instance.parentElement, parent);
    });

    it("check input change", async () => {

    });


});