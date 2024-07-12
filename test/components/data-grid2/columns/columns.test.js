import {Columns, Alignment, SortDirection} from "./../../../../components/data-grid2/columns/columns.js";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("Columns class - add method", () => {
    const columns = new Columns();
    columns.add("Title", 200, Alignment.CENTER, true, SortDirection.ASC);

    const expected = [{
        title: "Title",
        width: 200,
        align: Alignment.CENTER,
        sortable: true,
        sortDirection: SortDirection.ASC
    }];

    assertEquals(columns.get(), expected);
});

Deno.test("Columns class - toCSS method", () => {
    const columns = new Columns();
    columns.add("Title", 200, Alignment.CENTER, true, SortDirection.ASC);
    columns.add("Title2", 200, Alignment.CENTER, true, SortDirection.ASC);

    const expected = "repeat(2, 200px)";
    const actual = columns.toCSS();

    assertEquals(actual, expected);
});

Deno.test("Columns class - dispose method", () => {
    const columns = new Columns();
    columns.add("Title", 200, Alignment.CENTER, true, SortDirection.ASC);
    columns.dispose();

    assertEquals(columns.get(), null);
});