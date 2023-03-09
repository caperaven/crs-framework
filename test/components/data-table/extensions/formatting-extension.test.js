import { beforeAll, beforeEach, afterEach, describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {init} from "./../../../../test/mockups/init.js";
import FormattingExtension from "../../../../components/data-table/extensions/formatting-extension.js";

await init();

beforeAll(async () => {
    // await import("./../../../../src/data-manager/data-manager-actions.js");
    // await import("./../../../../components/data-table/data-table-actions.js");
})

describe ("formatting-extension tests", async () => {
    let table;
    let instance;

    beforeEach(async () => {
        table = {
            getColumnIndex: (name) => { return 0; }
        }

        instance = new FormattingExtension(table, {
            rows: [
                {
                    condition: "model.code === 'A'",
                    classes: ["row-a"],
                    styles: "background-color: red; color: white;"
                }
            ],
            columns: {
                "code": [
                    {
                        condition: "model.price < 20",
                        classes: ["low-price"],
                        styles: "background-color: green; color: white;"
                    }
                ]
            }
        });
    });

    afterEach(async () => {
        table = null;
        instance.dispose();
        instance = null;
    });

    it("createFormattingCode", async () => {
        const code = [];
        instance.createFormattingCode(code);

        assert(code[0] == `rowElement.classList = [];`);
        assert(code[1] == `rowElement.style["background-color"] = "";`);
        assert(code[2] == `rowElement.style["color"] = "";`);
        assert(code[3] == `if (model.code === 'A') {`);
        assert(code[4] == `    rowElement.classList.add("row-a");`);
        assert(code[5] == `    rowElement.style["background-color"] = "red";`);
        assert(code[6] == `    rowElement.style["color"] = "white";`);
        assert(code[7] == `}`);
        assert(code[8] == `let cellElement;`);
        assert(code[9] == `cellElement = rowElement.children[0];`);
        assert(code[10] == `cellElement.classList = [];`);
        assert(code[11] == `cellElement.style["background-color"] = "";`);
        assert(code[12] == `cellElement.style["color"] = "";`);
        assert(code[13] == `if (model.price < 20) {`);
        assert(code[14] == `    cellElement.classList.add("low-price");`);
        assert(code[15] == `    cellElement.style["background-color"] = "green";`);
        assert(code[16] == `    cellElement.style["color"] = "white";`);
        assert(code[17] == `}`);
    })
});