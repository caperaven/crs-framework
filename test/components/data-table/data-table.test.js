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
        await crs.call("data_manager", "register", {
            manager: "data_manager",
            id_field: "id",
            type: "memory",
            records: [
                { id: 1, code: "row 1 code", description: "row 1 description" },
                { id: 2, code: "row 2 code", description: "row 2 description" },
                { id: 3, code: "row 3 code", description: "row 3 description" }
            ]
        });

        instance = document.createElement("data-table");
        instance.dataset["manager"] = "data_manager";
        instance.dataset["manager-key"] = "data_manager_key";

        createChildrenFromHtml(instance, [
            `<column data-heading="code" data-property="code" data-width="100"></column>`,
            `<column data-heading="description" data-property="description" data-width="200"></column>`
        ].join(" "), false);

        await instance.connectedCallback();
    })

    afterEach(async () => {
        instance.disconnectedCallback();
        instance = null;
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
        await instance.refresh();

        const tableHeader = instance.shadowRoot.querySelector("#tableHeader");
        assertEquals(tableHeader.children.length, 2);

        const tableBody = instance.shadowRoot.querySelector("tbody");
        assertEquals(tableBody.children.length, 3);
        assertEquals(tableBody.children[0].children[0].innerText, "row 1 code");
        assertEquals(tableBody.children[1].children[0].innerText, "row 2 code");
        assertEquals(tableBody.children[2].children[0].innerText, "row 3 code");

    });

    it ("data manager add record", async () => {
        await instance.refresh();

        await crs.call("data_manager", "append", {
            manager: "data_manager",
            records: [{ id: 4, code: "row 4 code", description: "row 4 description" }]
        });

        const tableBody = instance.shadowRoot.querySelector("tbody");
        assertEquals(tableBody.children.length, 4);
        assertEquals(tableBody.children[3].children[0].innerText, "row 4 code");
    });

    it ("data manager remove record", async () => {
        await instance.refresh();

        await crs.call("data_manager", "remove", {
            manager: "data_manager",
            indexes: [0, 1]
        });

        const tableBody = instance.shadowRoot.querySelector("tbody");
        assertEquals(tableBody.children.length, 1);
        assertEquals(tableBody.children[0].children[0].innerText, "row 3 code");
    })

    it ("data manager update record", async () => {
        await instance.refresh();

        await crs.call("data_manager", "update", {
            manager: "data_manager",
            id: 2,
            changes: { code: "row 2 code updated", description: "row 2 description updated" }
        });

        const tableBody = instance.shadowRoot.querySelector("tbody");
        assertEquals(tableBody.children[1].children[0].innerText, "row 2 code updated");
    })

    it("click to set selected row", async () => {
        await instance.refresh();

        const row = instance.shadowRoot.querySelector("tbody").children[0];
        const row2 = instance.shadowRoot.querySelector("tbody").children[1];
        const row3 = instance.shadowRoot.querySelector("tbody").children[2];

        assert(row != null);
        assert(row.getAttribute("aria-selected") == null);

        row.parentNode = instance.shadowRoot.querySelector("tbody");
        // console.log(row.parentNode.nodeName);
        await instance.performEvent("click", row);
        assertEquals(row.getAttribute("aria-selected"), "true");

        await instance.performEvent("click", row2);
        assertEquals(row.getAttribute("aria-selected"), undefined);
        assertEquals(row2.getAttribute("aria-selected"), "true");

        await instance.performEvent("click", row3);
        assertEquals(row2.getAttribute("aria-selected"), undefined);
        assertEquals(row3.getAttribute("aria-selected"), "true");
    });

    it("navigate through rows using arrow keys", async () => {
       await instance.refresh();
         const row1 = instance.shadowRoot.querySelector("tbody").children[0];
        row1.dataset.id = 1;
        row1.setAttribute("tabindex", "0");
        document.activeElement = row1;
        // console.log(document.activeElement.nodeName);
        // console.log(row1.getAttribute("tabindex"));
        // console.log(instance.shadowRoot.querySelector("tbody").children.length);
        await instance.performEvent("keyup", row1,{ key: "Enter" });
        // console.log(row1.getAttribute("aria-selected"));
        // console.log(row1.getAttribute("aria-focused"));

        const row2 = instance.shadowRoot.querySelector("tbody").children[1];
        row2.dataset.id = 2;
        row2.id = "row2";
        row2.setAttribute("tabindex", "0");
        await instance.performEvent("keyup", row1,{ key: "ArrowDown" });
        // console.log(row1.getAttribute("aria-focused"));
        // console.log(row2.getAttribute("aria-focused"));
        assertEquals(row2.getAttribute("aria-focused"), "true");
        assert(row1.getAttribute("aria-focused") == null);
        assertEquals(globalThis.activeElement.id, row2.id);

        const row3 = instance.shadowRoot.querySelector("tbody").children[2];
        row3.dataset.id = 3;
        row3.id = "row3";
        row3.setAttribute("tabindex", "0");
        await instance.performEvent("keyup", row2,{ key: "ArrowDown" });
        await instance.performEvent("keyup", row3,{ key: "Enter" });
        // console.log(row2.getAttribute("aria-focused"));
        // console.log(row3.getAttribute("aria-focused"));
        assertEquals(row3.getAttribute("aria-focused"), "true");
        assert(row2.getAttribute("aria-focused") == null);
        assertEquals(globalThis.activeElement.id, row3.id);

        await instance.performEvent("keyup", row3,{ key: "Shift+Tab" });
        await instance.performEvent("keyup", row2,{ key: "Shift+Tab" });
        await instance.performEvent("keyup", row1,{ key: "Enter" });
        // console.log(row1.getAttribute("aria-selected"));
        assertEquals(row1.getAttribute("aria-selected"), "true");

        await instance.performEvent("keyup", row1,{ key: "Tab" });
        await instance.performEvent("keyup", row2,{ key: "Enter" });
        assertEquals(row2.getAttribute("aria-selected"), "true");
    });
})