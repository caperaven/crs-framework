import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals, assertExists, assert } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {Columns} from "../../../../components/matrix-renderer/factories/columns-factory.js";
import {Regions} from "../../../../components/matrix-renderer/factories/regions-factory.js";

const COLUMNS_DEFINITION = [
    {title: "Title 1", field: "field1"},
    {title: "Title 2", field: "field2"},
    {title: "Title 3", field: "field3"},
    {title: "Title 4", field: "field4"},
    {title: "Title 5", field: "field5"},
    {title: "Title 6", field: "field6"},
    {title: "Title 7", field: "field7"},
    {title: "Title 8", field: "field8"},
    {title: "Title 9", field: "field9"},
    {title: "Title 10", field: "field10"}
]

describe("regions factory", () => {
    it ("default", async () => {
        const definition = {
            heights: {
                groupHeader: 50,
                header: 40,
                row: 30
            },
            columns: Columns.from(COLUMNS_DEFINITION),
            headers: [
                { from: 0, to: 3, title: "Group 1" },
                { from: 4, title: "Group 2" }
            ],
            canvas: {
                width: 1024,
                height: 768
            }
        }

        const regions = Regions.from(definition);
    })
})