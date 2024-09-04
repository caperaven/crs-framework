import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import {ColumnBuilder, DataType, Align} from "../../../../components/matrix-renderer/builders/column-builder.js";

describe("column builder tests", () => {
    it("default", async () => {
        const column = new ColumnBuilder().build();
        assertEquals(column.title, "");
        assertEquals(column.field, "");
        assertEquals(column.width, 100);
        assertEquals(column.type, DataType.TEXT);
        assertEquals(column.align, Align.LEFT);
        assertEquals(column.editable, false);
    })

    it ("custom", async () => {
        const column = new ColumnBuilder()
            .setTitle("Title")
            .setField("field")
            .setWidth(200)
            .setType(DataType.NUMBER)
            .setAlign(Align.RIGHT)
            .setEditable(true)
            .build();

        assertEquals(column.title, "Title");
        assertEquals(column.field, "field");
        assertEquals(column.width, 200);
        assertEquals(column.type, DataType.NUMBER);
        assertEquals(column.align, Align.RIGHT);
        assertEquals(column.editable, true);
    })

    it ("from", async () => {
        const column = ColumnBuilder.from({ title: "Title", field: "field" }).build();

        assertEquals(column.title, "Title");
        assertEquals(column.field, "field");
        assertEquals(column.width, 100);
        assertEquals(column.type, DataType.TEXT);
        assertEquals(column.align, Align.LEFT);
        assertEquals(column.editable, false);
    })
})
