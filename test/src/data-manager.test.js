import {beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../test/mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/data-manager.js");
})

describe("data manager tests", () => {
    let records;
    let manager;

    beforeEach(async () => {
        records = [
            { id: "1000", code: "code 1" },
            { id: "1001", code: "code 2" }
        ];

        manager = await crs.call("data_manager", "register", {
            manager: "store",
            id_field: "id",
            type: "memory",
            records: records
        })
    })

    it ("initialized", async () => {
        const manager_records = manager.getAll();

        assert(globalThis.dataManagers != null);
        assert(globalThis.dataManagers["store"] != null);
        assertEquals(manager.count, 2);
        assertEquals(manager_records, records);
    })

    it ("set_record", async () => {
        const records = [
            { id: "1002", code: "code 3" },
            { id: "1003", code: "code 4" }
        ];

        await crs.call("data_manager", "set_records", {
            manager: "store",
            records: records
        })

        const manager_records = await crs.call("data_manager", "get_all", { manager: "store" });
        assertEquals(manager_records, records);
    })

    it ("append", async () => {
        await crs.call("data_manager", "append", {
            manager: "store",
            records: [{ id: "2000", "code":  "2000" }]
        })

        const record = manager.getIndex(2);
        assertEquals(manager.count, 3);
        assertEquals(record.id, "2000");
    })

    it ("remove - by index", async () => {
        await crs.call("data_manager", "remove", {
            manager: "store",
            indexes: [1]
        })

        assertEquals(manager.count, 1);
    })

    it ("remove - by id", async () => {
        await crs.call("data_manager", "remove", {
            manager: "store",
            ids: ["1000"]
        })

        assertEquals(manager.count, 1);
    })

    it ("update - by index", async () => {
        await crs.call("data_manager", "update", {
            manager: "store",
            index: 0,
            changes: {
                code: "ABC"
            }
        })

        const record = manager.getIndex(0);
        assertEquals(record.code, "ABC");
    })

    it ("update - by id", async () => {
        await crs.call("data_manager", "update", {
            manager: "store",
            id: "1000",
            changes: {
                code: "ABC"
            }
        })

        const record = manager.getIndex(0);
        assertEquals(record.code, "ABC");
    })
})


//
// Deno.test("data manager - update", async () => {
//     /**
//      *  Remove a new record to the existing collection
//      */
//
//     await crs.call("data_manager", "update", {
//         manager: "work_orders_store",
//         index: 0, // index or id
//         changes: {
//             "property1": "value",
//             "property2": "value"
//         }
//     })
// })
//
//
// Deno.test("data manager - update_batch", async () => {
//     /**
//      *  Change properties on an existing record
//      */
//
//     await crs.call("data_manager", "update_batch", {
//         manager: "work_orders_store",
//
//         /**
//          * scenarios:
//          * 1. index -> update the record at that index
//          * 2. id -> find that record and update it
//          * 3. index and id -> check if that record matches the id I gave, if true then update else perform step 2.
//           */
//
//         batch: [
//             {
//                 index: 0, // index / id,
//                 changes: {
//                     "property1": "value",
//                     "property2": "value"
//                 }
//             }
//         ]
//     })
// })
//
// Deno.test("data manager - get", async () => {
//     /**
//      *  Get a record at a given index
//      */
//
//     await crs.call("data_manager", "get", {
//         manager: "work_orders_store",
//         indexes: 0 // indexes or ids
//     })
// })
//
// Deno.test("data manager - get_page", async () => {
//     /**
//      *  Get any number of records based on start index and page
//      */
//
//     await crs.call("data_manager", "get_page", {
//         manager: "work_orders_store",
//         from: 0,
//         to: 99
//     })
// });
