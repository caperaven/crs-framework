import {beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../../../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../../../packages/crs-process-api/action-systems/data-processing-actions.js");
    await import("../../../../src/managers/data-manager/data-manager-actions.js");
    await import("../../../../src/managers/perspective-manager/perspective-manager-actions.js");

    const records = [];

    for (let i = 0; i < 100; i++) {
        records.push({
            id: i,
            code: `code_${i}`,
            value: i + 10
        })
    }

    await crs.call("data_manager", "register", {
        manager: "store",
        id_field: "id",
        type: "memory",
        records: records
    })

    await crs.call("perspective", "register", {
        perspective: "my_perspective"
    })
});

afterAll(async () => {
    await crs.call("data_manager", "unregister", {
        manager: "store"
    })

    await crs.call("perspective", "unregister", {
        perspective: "my_perspective"
    })
});

describe("data manager tests", () => {
    let instance;

    beforeEach(async () => {
        instance = await crs.call("data_manager", "register", {
            manager: "perspective_store",
            id_field: "id",
            type: "perspective",
            perspective: "my_perspective",
            source_manager: "store"
        })
    })

    afterEach(async () => {
        await crs.call("data_manager", "unregister", {
            manager: "perspective_store"
        })
    })

    it("initialized", async () => {
        assertEquals(instance.constructor.name, "DataManagerPerspectiveProvider");
        assertEquals(instance.perspective, "my_perspective");
        assertEquals(instance.manager, "store");
    })

    it("perspective is registered", async () => {
        let perspectiveChanged = false;
        const perspectiveChangedBackup = instance.perspectiveChanged;
        instance.perspectiveChanged = () => perspectiveChanged = true;

        await crs.call("perspective", "add_filter", {
            perspective: "my_perspective",
            field: "id",
            operator: "gt",
            value: 50
        });

        assertEquals(perspectiveChanged, true);
        instance.perspectiveChanged = perspectiveChangedBackup;
    })

    it ("perspective, update records", async () => {
        await crs.call("perspective", "add_filter", {
            perspective: "my_perspective",
            field: "id",
            operator: "gt",
            value: 50
        });

        const records = await crs.call("data_manager", "get_all", {
            manager: "perspective_store"
        });

        // filter was applied and the records set
        // assert the array length, the first item and last item
        assertEquals(records.length, 49);
        assertEquals(records[0].id, 51);
        assertEquals(records[48].id, 99);
    })

    it ("perspective, get page after filter", async () => {
        await crs.call("perspective", "add_filter", {
            perspective: "my_perspective",
            field: "id",
            operator: "gt",
            value: 50
        });

        const records = await crs.call("data_manager", "get_page", {
            manager: "perspective_store",
            page: 1,
            size: 10
        });
        // filter was applied and the records set
        // assert the array length, the first item and last item
        assertEquals(records.length, 10);
        assertEquals(records[0].id, 51);
        assertEquals(records[9].id, 60);
    })
});