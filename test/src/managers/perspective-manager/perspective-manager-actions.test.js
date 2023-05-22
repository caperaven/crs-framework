import {beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../../../mockups/init.js";
import {SizeManager} from "../../../../src/managers/virtualization/size-manager.js";

await init();

beforeAll(async () => {
    await import("../../../../src/managers/perspective-manager/perspective-manager-actions.js");
})

const PERSPECTIVE_NAME = "test_perspective";

describe("perspective manager tests", () => {
    beforeEach(async () => {
        await crs.call("perspective", "register", {
            perspective: PERSPECTIVE_NAME
        });
    });

    afterEach(async () => {
        await crs.call("perspective", "unregister", {
            perspective: PERSPECTIVE_NAME
        });
    });

    it ("initialized", async () => {
        assert(globalThis.perspectives[PERSPECTIVE_NAME].count === 1);
    })

    it ("add filter", async () => {
        await crs.call("perspective", "add_filter", {
            perspective: PERSPECTIVE_NAME,
            field: "isActive",
            operator: "eq",
            value: true
        });

        const filterDefinition = globalThis.perspectives[PERSPECTIVE_NAME].filter;
        assertExists(filterDefinition);
        assertEquals(filterDefinition[0].field, "isActive");
        assertEquals(filterDefinition[0].operator, "eq");
        assertEquals(filterDefinition[0].value, true);
    })

    it ("remove filter", async () => {
        await crs.call("perspective", "add_filter", {
            perspective: PERSPECTIVE_NAME,
            field: "isActive",
            operator: "eq",
            value: true
        });

        assertExists(globalThis.perspectives[PERSPECTIVE_NAME].filter);

        await crs.call("perspective", "remove_filter", {
            perspective: PERSPECTIVE_NAME,
            field: "isActive"
        });

        const filterDefinition = globalThis.perspectives[PERSPECTIVE_NAME].filter;
        assert(filterDefinition == null);
    })

    it ("add grouping", async () => {
        await crs.call("perspective", "set_grouping", {
            perspective: PERSPECTIVE_NAME,
            fields: ["isActive", "site"]
        })

        const groupDefinition = globalThis.perspectives[PERSPECTIVE_NAME].grouping;
        assertExists(groupDefinition);
        assertEquals(groupDefinition, ["isActive", "site"]);
    });
})