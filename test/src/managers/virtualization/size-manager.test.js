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

    it ("get data index", async () => {
        assertEquals(instance.getDataIndex(0), 0);
        assertEquals(instance.getDataIndex(32), 1);
        assertEquals(instance.getDataIndex(64), 2);
        assertEquals(instance.getDataIndex(100), 3);
        assertEquals(instance.getDataIndex(500), 15);
        assertEquals(instance.getDataIndex(1000), 31);
        assertEquals(instance.getDataIndex(2000), 62);
        assertEquals(instance.getDataIndex(3000), 93);
        assertEquals(instance.getDataIndex(3200), 100);
        assertEquals(instance.getDataIndex(4000), 100);
    });
});