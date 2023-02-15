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
        // when I click on this button (with id="btnToggleExpand") then toggle the aria-expanded attribute
        // by calling #toggleExpanded
        const btnToggleExpandMock = new ElementMock("button");
        btnToggleExpandMock.id = "btnToggleExpand";

        instance.clickHandler(new EventMock(btnToggleExpandMock));
        assertEquals(instance.getAttribute("aria-expanded"), "false");

        instance.clickHandler(new EventMock(btnToggleExpandMock));
        assertEquals(instance.getAttribute("aria-expanded"), "true");
    })

    it("check for header content", async () => {
        instance.dataset.title = "test title";
        assertEquals(instance.dataset.title, "test title");

        const header = new ElementMock("header");
        header.id = "group-header";
        instance.appendChild(header);
        const groupHeader = instance.querySelector("#group-header");

        assert(instance.header !== null);
        assert(instance.getAttribute("aria-expanded") === "true");

        instance.activeElement = header;
        instance.headerKeyHandler(new EventMock(header,  {key: "ArrowUp"}));

        assertEquals(instance.getAttribute("aria-expanded"), "false");

        instance.headerKeyHandler(new EventMock(header,  {key: "ArrowDown"}));
        assertEquals(instance.getAttribute("aria-expanded"), "true");
    });
});