import { beforeAll, beforeEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";

await init();

beforeAll(async () => {
    await import("../../../components/text-editor/text-editor.js");
})

describe ("text-editor", async () => {
    let instance;
    beforeEach(async () => {
        instance = document.createElement("text-editor");
        await instance.connectedCallback();
    })

    it ("value", async () => {
        const value = "# Hello World";

        instance.value = value;
        assertEquals(instance.value, value);
    })
})