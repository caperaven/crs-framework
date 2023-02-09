import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();
let instance;

async function createInstance() {
    instance = document.createElement("group-box");
    await instance.connectedCallback();
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(instance);
        }, 0);
    });

    let loadFn = instance.load;
    instance.load = async () => {
        createMockChildren(instance);
        await loadFn();
    }

    // let fetchFn = instance.fetch;
    // instance.fetch = async () => {
    //     createMockChildren(instance);
    //     // await fetchFn();
    //     return `<header>
    //         <button id="btnToggleExpand" class="icon"></button>
    //         <slot id="group-header" name="header"></slot>
    //         <slot name="actions"></slot>
    //         </header>
    //
    //         <div id="main">
    //         <slot name="body"></slot>
    //         </div>   ` ;
    //
    // }
}

beforeAll(async () => {
    await import("../../../components/group-box/group-box.js");
})

describe ("group box tests", async () => {
    // let instance;



    // beforeEach(async () => {
    //     instance = document.createElement("group-box");
    //     await instance.connectedCallback();
    // })

    afterEach(async () => {
        await instance.disconnectedCallback();
    })

    it("instance is not null", async () => {
        await createInstance();
        assert(instance !== null);
        assertEquals(instance.getAttribute("aria-expanded"), "true");
    });

    it("expand and collapse on click", async () => {
        await createInstance();
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
        await createInstance();
        instance.dataset.title = "test title";
        assertEquals(instance.dataset.title, "test title");

        const header = new ElementMock("header");
        header.id = "group-header";
        instance.appendChild(header);
        const groupHeader = instance.querySelector("#group-header");
        // console.log(groupHeader.id);

        assert(instance.header !== null);
        assert(instance.getAttribute("aria-expanded") === "true");

        // instance.headerKeyHandler(new EventMock(header, "keyup", {key: "ArrowUp"}));
        // instance.headerKeyHandler(new EventMock(groupHeader, "keyup", {key: "ArrowUp"}));
        instance.activeElement = header;
        instance.headerKeyHandler(new EventMock(header,  {key: "ArrowUp"}));
        // instance.headerKeyHandler(new EventMock(groupHeader));
        // instance.headerKeyHandler(new EventMock(header, "ArrowUp", {key: "ArrowUp"}));


        assertEquals(instance.getAttribute("aria-expanded"), "false");

        instance.headerKeyHandler(new EventMock(header,  {key: "ArrowDown"}));
        assertEquals(instance.getAttribute("aria-expanded"), "true");
    });


});