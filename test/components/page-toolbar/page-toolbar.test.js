import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../test/mockups/init.js";
import {createMockChildren, ElementMock} from "../../mockups/element-mock.js";
import {EventMock} from "../../mockups/event-mock.js";

await init();

beforeAll(async () => {
    await import("../../../components/page-toolbar/page-toolbar.js");
})

describe ("page-toolbar tests", async () => {
    let instance;

    beforeEach(async () => {
        instance = document.createElement("page-toolbar");
        await instance.connectedCallback();
    })

    it("instance is not null", async () => {
        assert(instance !== null);
    });
})