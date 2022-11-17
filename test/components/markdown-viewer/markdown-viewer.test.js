import { beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";

await init();

beforeAll(async () => {
    await import("../../../components/markdown-viewer/markdown-viewer.js");
})

describe ("markdown-viewer", async () => {
    let instance;
    beforeEach(async () => {
        instance = document.createElement("markdown-viewer");
    })

    it ("set markdown", async () => {

    })
})