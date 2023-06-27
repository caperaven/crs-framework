import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { ElementMock} from "../../mockups/element-mock.js";
import {init} from "./../../../test/mockups/init.js";

await init();

beforeAll(async () => {
    await import("../../../components/combo-box/combo-box.js");
})

describe ("combobox tests", async () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("combo-box");
        await instance.connectedCallback();
    });

    afterEach(async () => {
        await instance.disconnectedCallback();
    })
})