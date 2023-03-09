import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../../test/mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../../../src/data-manager/data-manager-actions.js");
    await import("./../../../../components/data-table/data-table-actions.js");
})

describe ("formatting-extension tests", async () => {
    let table;

    beforeEach(async () => {
        table = document.createElement("data-table");
        await table.connectedCallback();
    });

    afterEach(async () => {
        await table.disconnectedCallback();
        table = null;
    });
});