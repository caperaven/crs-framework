import { beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";

await init();

let gridInstance;
let kbInstance;

beforeAll(async () => {
    await import("./../../../src/actions/columns-actions.js");
    await import("./../../../components/data-grid/data-grid.js");
    await import("./../../../components/kan-ban/kan-ban.js");
})

afterAll(async () => {
})

describe("data grid tests", () => {
    beforeEach(async () => {
        gridInstance = document.createElement("data-grid");
        kbInstance = document.createElement("kan-ban");

        await gridInstance.connectedCallback();
        await kbInstance.connectedCallback();

        createMockChildren(gridInstance);
        createMockChildren(kbInstance);
    });

    afterEach(async () => {
        gridInstance = await gridInstance.disconnectedCallback();
        kbInstance = await kbInstance.disconnectedCallback();
    });

    it("initialized", () => {
        assertExists(gridInstance.columns, "grid columns should exist");
        assertExists(gridInstance.columnGroups, "grid column groups should exist");
        assertExists(kbInstance.columns, "kb columns should exist");
    })

    it ("add column", async () => {
        await crs.call("grid_columns", "add_columns", {
            element: gridInstance,
            columns: [{title: "code", width: 100}]
        })

        await crs.call("grid_columns", "add_columns", {
            element: kbInstance,
            columns: [{title: "code", width: 100}]
        })

        assertEquals(kbInstance.header.children.length, 1);
        assertEquals(kbInstance.container.children.length, 1);

        const grid = gridInstance.querySelector('[role="grid"]');
        assertEquals(grid.children.length, 2); // column + row container
    })
});