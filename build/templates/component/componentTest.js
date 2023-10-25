import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";


await init();

beforeAll(async () => {
    await import("../../../components/__element__/__element__.js");
})

describe ("__element__ tests", async () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("__element__");
        await instance.connectedCallback();
    })

    it("instance is not null", async () => {
        assert(instance !== null);
    });
})