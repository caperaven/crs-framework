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

})