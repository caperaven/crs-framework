import {Columns, Alignment, SortDirection, DataType, ConversionType} from "./../../../../components/data-grid2/columns/columns.js";
import { assertThrows, assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("Columns class - add method", () => {
    const columns = new Columns();
    columns.add("Title", "Field1", DataType.STRING, true, 200, Alignment.CENTER, true, SortDirection.ASC);

    const expected = [{
        title: "Title",
        field: "Field1",
        dataType: DataType.STRING,
        isReadOnly: true,
        width: 200,
        align: Alignment.CENTER,
        sortable: true,
        sortDirection: SortDirection.ASC,
        groupId: null
    }];

    assertEquals(columns.get(), expected);
});

Deno.test("Columns class - add method with no title", () => {
    const columns = new Columns();
    const error = assertThrows(() => {
        columns.add(null, "Field1");
    });

    assertEquals(error.message, "[data-grid2.columns] Column title is required");
})

Deno.test("Columns class - add method with no field", () => {
    const columns = new Columns();
    const error = assertThrows(() => {
        columns.add("Title", null);
    });

    assertEquals(error.message, "[data-grid2.columns] Column field is required");
})

Deno.test("Columns class - toCSS method", () => {
    const columns = new Columns();

    columns.add("Title", "Field1", DataType.STRING, true, 200, Alignment.CENTER, true, SortDirection.ASC);
    columns.add("Title2", "Field2", DataType.NUMBER, false, 200, Alignment.CENTER, true, SortDirection.ASC);

    const expected = "repeat(2, 200px)";
    const actual = columns.to(ConversionType.CSS);

    assertEquals(actual, expected);
});

Deno.test("Columns class - dispose method", () => {
    const columns = new Columns();
    columns.add("Title", "Field1", DataType.STRING, true, 200, Alignment.CENTER, true, SortDirection.ASC);
    columns.dispose();

    assertEquals(columns.get(), null);
});

Deno.test("Columns class - get method", () => {
    const columns = new Columns();
    columns.add("Title", "Field1");

    const expected = [{
        title: "Title",
        field: "Field1",
        dataType: DataType.STRING,
        isReadOnly: true,
        width: 100,
        align: Alignment.LEFT,
        sortable: true,
        sortDirection: SortDirection.NONE,
        groupId: null
    }];

    assertEquals(columns.get(), expected);
    assertEquals(Object.isFrozen(columns.get()), true);
});

Deno.test("Columns class - get method with no columns", () => {
    const columns = new Columns();
    assertEquals(columns.get(), []);
});

Deno.test("Columns class - set method", () => {
    const columns = new Columns();
    columns.add("Title", "Field1");

    const expected = [{
        title: "Title",
        field: "Field1",
        dataType: DataType.STRING,
        isReadOnly: true,
        width: 100,
        align: Alignment.LEFT,
        sortable: true,
        sortDirection: SortDirection.NONE,
        groupId: null
    }];

    assertEquals(columns.get(), expected);

    columns.set([
        {
            title: "Title2",
            field: "Field2",
            dataType: DataType.NUMBER,
            isReadOnly: false,
            width: 200,
            align: Alignment.CENTER,
            sortable: true,
            sortDirection: SortDirection.ASC,
            groupId: null
        }
    ]);

    const expected2 = [{
        title: "Title2",
        field: "Field2",
        dataType: DataType.NUMBER,
        isReadOnly: false,
        width: 200,
        align: Alignment.CENTER,
        sortable: true,
        sortDirection: SortDirection.ASC,
        groupId: null
    }];

    assertEquals(columns.get(), expected2);
});