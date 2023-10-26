import {assertEquals, beforeAll, beforeEach, describe, it, assert} from "../../../dependencies.js";
import {init} from "../../../mockups/init.js";
import {createChildrenFromHtml} from "../../../mockups/child-mock-factory.js";
import {afterEach} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {TemplateMock} from "../../../mockups/template-mock.js";

await init();

let virtualized = false;

crs.intent.virtualization = {
    enable: async () => { virtualized = true; },
    disable: async () => { virtualized = false; }
}

describe("Layout", () => {
    let instance;
    let headerInflationCalled = false;

    beforeAll(async () => {
        await import("./../../../../components/kan-ban/swim-lane/swim-lane.js");
        await import("./../../../../components/kan-ban/cards-manager/cards-manager-actions.js");
        await import("./../../../../src/managers/data-manager/data-manager-actions.js");

        await crs.call("cards_manager", "register", {
            name: "headerCard",
            template: new TemplateMock("<h2></h2>"),
            inflationFn: (element, record) => { headerInflationCalled = true; }
        })

        await crs.call("cards_manager", "register", {
            name: "recordCard",
            template: new TemplateMock("<h2></h2>"),
            inflationFn: (element, record) => { headerInflationCalled = true; }
        })

        const data = [{
            id: 1,
            code: "code_1",
            value: 11
        }];

        instance = await crs.call("data_manager", "register", {
            manager: "testManager",
            id_field: "id",
            type: "memory",
            records: data
        })
    });

    beforeEach(async () => {
        instance = document.createElement("swim-lane");
        instance.dataset.manager = "testManager";
        instance.dataset.headerCard = "headerCard";
        instance.dataset.recordCard = "recordCard";
        instance.dataset.allowDrag = "false";
        instance.dataset.allowDrop = "false";
        await instance.connectedCallback();
    });

    afterEach(async () => {
        await instance.disconnectedCallback();
    })

    it ("should have a swim-lane", async () => {
        assert(instance.shadowRoot.children.length > 0);
    })

    it ("inflate header", async () => {
        instance.dataset.ready = "true";

        headerInflationCalled = false;
        await instance.setHeader({ title: "test" });
        assertEquals(headerInflationCalled, true);
    })
});