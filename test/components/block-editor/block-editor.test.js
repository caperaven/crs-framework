import {BlockEditor} from "./../../../components/block-editor/block-editor.js"

import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert, assertExists } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";

await init();
let instance;

beforeAll(() => {
    return new Promise(resolve => {
        instance = new BlockEditor();
        instance.addEventListener("ready", resolve);
    })
})

describe("block editor tests", async () => {
    it("instance is not null", async () => {
        assert(instance !== null);
    });

    it("get widget library data", async () => {
        const data = await crsbinding.events.emitter.emit("getWidgetLibrary");
        assertExists(data);
        assertEquals(data.name, "asset-library");
    })
});