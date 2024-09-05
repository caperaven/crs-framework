import { describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { Columns, DataType, Align } from "../../../../components/matrix-renderer/columns.js";

describe("column builder tests", () => {
    it ("from", () => {
        const columns = Columns.from([
            {title: "Title 1", field: "field1"},
            {title: "Title 2", field: "field2"}
        ]);

        assertEquals(columns.length, 2);
        assertEquals(columns[0].title, "Title 1");
        assertEquals(columns[0].field, "field1");
        assertEquals(columns[0].width, 100);
        assertEquals(columns[0].type, DataType.TEXT);
        assertEquals(columns[0].align, Align.LEFT);
        assertEquals(columns[0].editable, false);

        assertEquals(columns[1].title, "Title 2");
        assertEquals(columns[1].field, "field2");
        assertEquals(columns[1].width, 100);
        assertEquals(columns[0].type, DataType.TEXT);
        assertEquals(columns[0].align, Align.LEFT);
        assertEquals(columns[0].editable, false);
    })
})