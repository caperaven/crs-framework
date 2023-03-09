import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../../test/mockups/init.js";
import {ColumnsManager} from "../../../../components/data-table/managers/columns-manager.js";
import {formattingFromChildren} from "../../../../components/data-table/utils/formattingFromChildren.js";

await init();

beforeAll(async () => {
    await import("./../../../../src/data-manager/data-manager-actions.js");
    await import("./../../../../components/data-table/data-table-actions.js");
})

describe ("formattingFromChildren tests", async () => {
    let table;
    let settings;

    beforeEach(async () => {
        crs.intent.data_table.set_formatter = async (step, context, process, item) => {
            settings = step.args.settings;
        }

        table = document.createElement("data-table");
        appendFormatters(table);
        await table.connectedCallback();
    });

    afterEach(async () => {
        await table.disconnectedCallback();
        crs.intent.data_table.set_formatter = null;
        settings = null;
        table = null;
    });

    it("create column headers", async () => {
        await formattingFromChildren(table);

        assert(settings != null);
        assertEquals(settings.rows.length, 2);
        assertEquals(settings.rows[0].condition, "model.code == 'code 1'");
        assertEquals(settings.rows[0].classes, ["class1"]);
        assertEquals(settings.rows[0].styles, "background: blue; color: red;");

        assertEquals(settings.rows[1].condition, null);
        assertEquals(settings.rows[1].classes, ["class1"]);
        assertEquals(settings.rows[1].styles, "background: blue; color: red;");

        assertEquals(settings.columns.code.length, 1);
        assertEquals(settings.columns.code[0].condition, "model.price < 20>");
        assertEquals(settings.columns.code[0].classes, ["class2"]);
        assertEquals(settings.columns.code[0].styles, "background: yellow; color: green;");
    });
});

function appendFormatters(table) {
    appendRowFormatter(table);
    appendColumnsFormatter(table);
}

function appendRowFormatter(table) {
    const formatter = document.createElement("formatter");
    formatter.dataset["condition"] = "model.code == 'code 1'";
    formatter.dataset["classes"] = "class1";
    formatter.dataset["styles"] = "background: blue; color: red;";
    table.appendChild(formatter);

    const formatter2 = document.createElement("formatter");
    formatter2.dataset["classes"] = "class1";
    formatter2.dataset["styles"] = "background: blue; color: red;";
    table.appendChild(formatter2);
}

function appendColumnsFormatter(table) {
    const codeColumn = document.createElement("column");
    codeColumn.dataset.heading = "Code";
    codeColumn.dataset.property = "code";
    codeColumn.dataset.width = "100";

    const formatter = document.createElement("formatter");
    formatter.dataset["condition"] = "model.price < 20>";
    formatter.dataset["classes"] = "class2";
    formatter.dataset["styles"] = "background: yellow; color: green;";

    codeColumn.appendChild(formatter);
    table.appendChild(codeColumn);
}