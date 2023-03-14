import {beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "../../../mockups/init.js";
import {SizeManager} from "../../../../src/managers/virtualization/size-manager.js";

await init();

describe("size manager tests", () => {
    let instance;

    beforeEach(async () => {
        instance = new SizeManager(32, 100, 500);
    });

    afterEach(async () => {
        instance = instance.dispose();
    });

    it ("initialized", async () => {
        assertEquals(instance.contentHeight, 3200);
        assertEquals(instance.pageItemCount, 16);
    });
});