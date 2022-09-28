import {initRequired} from "../../mockups/init-required.js";
import { beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {ElementMock} from "../../mockups/element.mock.js";

await initRequired();

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

        gridInstance.grid = new ElementMock("div", "grid");
        gridInstance.rowContainer = new ElementMock("div", "rowContainer", gridInstance.grid);

        kbInstance.header = new ElementMock("div");
        kbInstance.container = new ElementMock("div");

        await gridInstance.connectedCallback();
        await kbInstance.connectedCallback();
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
        assertEquals(gridInstance.grid.children.length, 2); // column + row container
    })
});
    //
    // it("add column", async () => {
    //     await crs.call("grid_columns", "add_columns", {
    //         element: gridInstance,
    //         columns: [{ title: "code", width: 100 }]
    //     });
    //
    //     assertEquals(gridInstance.columns.length, 1);
    //     assertEquals(gridInstance.variables["--columns"], "100px");
    // })
    //
    //
    // it("remove column", async () => {
    //     await crs.call("grid_columns", "add_columns", {
    //         element: gridInstance,
    //         columns: [{ title: "code", width: 100 }, { title: "code2", width: 200 }]
    //     });
    //
    //     assertEquals(gridInstance.columns.length, 2);
    //     assertEquals(gridInstance.variables["--columns"], "100px 200px");
    //
    //     await crs.call("grid_columns", "remove_columns", {
    //         element: gridInstance,
    //         index: 1
    //     });
    //
    //     assertEquals(gridInstance.columns.length, 1);
    //     assertEquals(gridInstance.variables["--columns"], "100px");
    // })
    //
    // it ("add groups", async () => {
    //     await crs.call("grid_columns", "add_groups", {
    //         element: gridInstance,
    //         groups: [{ title: "group 1", index: 1, span: 2 }]
    //     });
    //
    //     assertEquals(gridInstance.columnGroups.length, 1);
    // })
    //
    // it ("remove groups", async () => {
    //     await crs.call("grid_columns", "add_groups", {
    //         element: gridInstance,
    //         groups: [{ title: "group 1", index: 1, span: 2 }, { title: "group 2", index: 1, span: 2 }]
    //     });
    //
    //     assertEquals(gridInstance.columnGroups.length, 2);
    //
    //     await crs.call("grid_columns", "remove_group", {
    //         element: gridInstance,
    //         index: 1
    //     });
    //
    //     assertEquals(gridInstance.columnGroups.length, 1);
    // })
    //
    // it("set width", async () => {
    //     await crs.call("grid_columns", "add_columns", {
    //         element: gridInstance,
    //         columns: [{ title: "code", width: 100 }]
    //     });
    //
    //     assertEquals(gridInstance.columns.length, 1);
    //     assertEquals(gridInstance.columns[0].width, 100);
    //
    //     await crs.call("grid_columns", "set_width", {
    //         element: gridInstance,
    //         index: 0,
    //         width: 200
    //     })
    //
    //     assertEquals(gridInstance.columns[0].width, 200);
    // })

// })