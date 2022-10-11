import { beforeAll, afterAll, afterEach, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../../src/index.js");
    await import("../../../components/kan-ban/kan-ban.js");
})

describe("kan-ban tests", () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("kan-ban");
        instance.dataset.manager = "test_manager";
        instance.dataset.template = "simple";
        instance.dataset.field = "status";
    })

    it("init", async () => {
        assert(instance != null);
    })
})