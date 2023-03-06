import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../../test/mockups/init.js";
import {ColumnsManager} from "../../../../components/data-table/managers/columns-manager.js";
import {columnsFromChildren} from "../../../../components/data-table/utils/columnsFromChildren.js";
import {createChildrenFromHtml} from "../../../mockups/child-mock-factory.js";

await init();

describe ("columnsHeadersFactory tests", async () => {
    let columnsManager;

    beforeEach(async () => {
        columnsManager = new ColumnsManager();
    });

    afterEach(async () => {
        columnsManager = columnsManager.dispose();
    });

    it("create column headers", async () => {
        const element = document.createElement("div");

        createChildrenFromHtml(element, [
            '<col data-heading="code" data-property="code" data-width="100"></col>',
            '<col data-heading="description" data-property="description" data-width="200"></col>'
        ].join(" "), false)

        columnsFromChildren(element.children, columnsManager);

        assertEquals(columnsManager.columns.length, 2);
    });
});