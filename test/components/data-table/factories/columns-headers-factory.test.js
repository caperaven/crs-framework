import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../../test/mockups/init.js";
import {ColumnsManager} from "../../../../components/data-table/managers/columns-manager.js";
import {columnsHeadersFactory} from "../../../../components/data-table/factories/columns-headers-factory.js";

await init();

describe ("columnsHeadersFactory tests", async () => {
    let columnsManager;
    const table = {
        callExtension: async (name, method, ...args) => {}
    };

    beforeEach(async () => {
        columnsManager = new ColumnsManager();
        columnsManager.set([
            {title: "code", width: 100, property: "code"},
            {title: "description", width: 200, property: "description"}
        ]);
    });

    afterEach(async () => {
        columnsManager = columnsManager.dispose();
    });

    it("create column headers", async () => {
        const result = await columnsHeadersFactory(columnsManager.columns, table);
        assertEquals(result.children.length, 2);
    });
});