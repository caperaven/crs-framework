import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren} from "../../mockups/child-mock-factory.js";

await init();

beforeAll(async () => {
    await import("../../../components/group-box/group-box.js");
})

describe ("group box tests", async () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("group-box");
        await instance.connectedCallback();
    })

    afterEach(async () => {
        await instance.disconnectedCallback();
    })

    it("instance is not null", async () => {
        assert(instance !== null);
    });
});