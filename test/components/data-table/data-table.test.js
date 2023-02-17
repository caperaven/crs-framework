import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";
import {createChildrenFromHtml} from "../../mockups/child-mock-factory.js";

await init();

beforeAll(async () => {
    await import("../../../src/data-manager/data-manager-actions.js");
    await import("../../../components/data-table/data-table.js");
})

describe ("data-table tests", async () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("data-table");
        instance.dataset["manager"] = "data_manager";
        instance.dataset["manager-key"] = "data_manager_key";

        createChildrenFromHtml(instance, [
            `<column data-heading="code" data-property="code" data-width="100"></column>`,
            `<column data-heading="description" data-property="description" data-width="200"></column>`
        ].join(" "), false);

        await instance.connectedCallback();
    })

    it("instance is not null", async () => {
        assert(instance !== null);
        assert(instance.columns.length === 2);
        assertEquals(instance.columns[0].heading, "code");
        assertEquals(instance.columns[0].property, "code");
        assertEquals(instance.columns[0].width, 100);
        assertEquals(instance.columns[1].heading, "description");
        assertEquals(instance.columns[1].property, "description");
        assertEquals(instance.columns[1].width, 200);
    });

    it ("build table using refresh - given rows", async () => {
        await instance.refresh([
            { code: "row 1 code", description: "row 1 description" },
            { code: "row 2 code", description: "row 2 description" },
            { code: "row 3 code", description: "row 3 description" }
        ]);

        const tableHeader = instance.shadowRoot.querySelector("#tableHeader");
        assertEquals(tableHeader.children.length, 2);

        const tableBody = instance.shadowRoot.querySelector("tbody");
        assertEquals(tableBody.children.length, 3);
    });

    it ("build table using refresh - data manager", async () => {
        await crs.call("data_manager", "register", {
            manager: "data_manager",
            id_field: "id",
            type: "memory",
            records: [
                { id: 0, code: "row 1 code", description: "row 1 description" },
                { id: 1, code: "row 2 code", description: "row 2 description" },
                { id: 2, code: "row 3 code", description: "row 3 description" }
            ]
        });

        await instance.refresh();

        const tableHeader = instance.shadowRoot.querySelector("#tableHeader");
        assertEquals(tableHeader.children.length, 2);

        const tableBody = instance.shadowRoot.querySelector("tbody");
        assertEquals(tableBody.children.length, 3);

        await crs.call("data_manager", "dispose", { manager: "data_manager" });
    });
})