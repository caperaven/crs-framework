import { beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {createMockChildren} from "./../../mockups/child-mock-factory.js";
import {init} from "./../../../test/mockups/init.js";
import {records} from "../../../app/kan-ban/data.js";

await init();

beforeAll(async () => {
    await import("./../../../src/index.js");
    await import("../../../src/data-manager/data-manager.js");
    await import("./../../../src/actions/columns-actions.js");
    await import("../../../components/kan-ban/kan-ban.js");

    await crs.call("data_manager", "register", {
        manager: "test_manager",
        id_field: "id",
        type: "memory"
    })
})

describe("kan-ban tests", () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("kan-ban");
        instance.dataset.manager = "test_manager";
        instance.dataset.template = "simple";
        instance.dataset.field = "status";
        await instance.connectedCallback();
        createMockChildren(instance);
    })

    afterEach(async () => {
        await instance.disconnectedCallback();
        instance = null;
    })

    it("init", async () => {
        assert(instance != null);
        assert(instance.header != null);
        assert(instance.container != null);
        assert(instance.columns != null);
    })

    it ("add columns", async () => {
        await crs.call("grid_columns", "add_columns", {
            element: instance,
            columns: [
                { id: 1001, width: 200, title: "Awaiting Approval", field: "status", statusId: 0, status: "awaiting approval" },
                { id: 1002, width: 200, title: "In Progress", field: "status", statusId: 1, status: "in progress" },
                { id: 1003, width: 200, title: "Closed", field: "status", statusId: 2, status: "closed" }
            ]
        });

        assertEquals(instance.columns.length, 3);
        assertEquals(instance.header.children.length, 3);
        assertEquals(instance.container.children.length, 3);
    })

    // it ("add data", async () => {
    //     await crs.call("grid_columns", "add_columns", {
    //         element: instance,
    //         columns: [
    //             { id: 1001, width: 200, title: "Awaiting Approval", field: "status", statusId: 0, status: "awaiting approval" },
    //             { id: 1002, width: 200, title: "In Progress", field: "status", statusId: 1, status: "in progress" },
    //             { id: 1003, width: 200, title: "Closed", field: "status", statusId: 2, status: "closed" }
    //         ]
    //     });
    //
    //     await crs.call("data_manager", "set_records", {
    //         manager: "test_manager",
    //         records: records
    //     })
    //
    // })
})