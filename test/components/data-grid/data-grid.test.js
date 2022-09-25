import {initRequired} from "./../../mockups/init-required.js";
import { beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.149.0/testing/asserts.ts";

await initRequired();

let instance;

beforeAll(async () => {
    const module = await import("../../../components/data-grid/data-grid.js");
    globalThis.DataGrid = module.default;
})

afterAll(async () => {
    globalThis.DataGrid = null;
})

describe("data grid tests", () => {

    beforeEach(async () => {
        instance = new globalThis.DataGrid;
        instance.variables = {};
        await instance.connectedCallback()
    });

    afterEach(async () => {
        instance = await instance.disconnectedCallback();
    });

    it("initialized", async () => {
        assertExists(instance.columns, "columns should exist");
        assertExists(instance.columnGroups, "column groups should exist");
    })

    it("add column", async () => {
        await crs.call("grid_columns", "add_columns", {
            element: instance,
            columns: [{ title: "code", width: 100 }]
        });

        assertEquals(instance.columns.length, 1);
        assertEquals(instance.variables["--columns"], "100px");
    })


    it("remove column", async () => {
        await crs.call("grid_columns", "add_columns", {
            element: instance,
            columns: [{ title: "code", width: 100 }, { title: "code2", width: 200 }]
        });

        assertEquals(instance.columns.length, 2);
        assertEquals(instance.variables["--columns"], "100px 200px");

        await crs.call("grid_columns", "remove_columns", {
            element: instance,
            index: 1
        });

        assertEquals(instance.columns.length, 1);
        assertEquals(instance.variables["--columns"], "100px");
    })

    it ("add groups", async () => {
        await crs.call("grid_columns", "add_groups", {
            element: instance,
            groups: [{ title: "group 1", index: 1, span: 2 }]
        });

        assertEquals(instance.columnGroups.length, 1);
    })

    it ("remove groups", async () => {
        await crs.call("grid_columns", "add_groups", {
            element: instance,
            groups: [{ title: "group 1", index: 1, span: 2 }, { title: "group 2", index: 1, span: 2 }]
        });

        assertEquals(instance.columnGroups.length, 2);

        await crs.call("grid_columns", "remove_group", {
            element: instance,
            index: 1
        });

        assertEquals(instance.columnGroups.length, 1);
    })

    it("set width", async () => {
        await crs.call("grid_columns", "add_columns", {
            element: instance,
            columns: [{ title: "code", width: 100 }]
        });

        assertEquals(instance.columns.length, 1);
        assertEquals(instance.columns[0].width, 100);

        await crs.call("grid_columns", "set_width", {
            element: instance,
            index: 0,
            width: 200
        })

        assertEquals(instance.columns[0].width, 200);
    })

})