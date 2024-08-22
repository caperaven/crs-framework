import {Columns} from "../../../../components/data-grid/columns/columns.js";
import {Column} from "../../../../components/data-grid/columns/column.js";
import {Alignment} from "../../../../components/data-grid/columns/enums/alignment.js";
import {SortDirection} from "../../../../components/data-grid/columns/enums/sort-direction.js";
import {DataType} from "../../../../components/data-grid/columns/enums/data-type.js";
import {ConversionType} from "../../../../components/data-grid/columns/enums/conversion-type.js";
import { assert, assertThrows, assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("Column.create with default parameters", () => {
    const column = Column.create("Test Title", "testField");
    const expected = {
        title: "Test Title",
        field: "testField",
        dataType: DataType.STRING,
        isReadOnly: true,
        width: 100,
        align: Alignment.LEFT,
        sortable: true,
        sortDirection: SortDirection.NONE,
        groupId: null,
        order: 0
    };
    assertEquals(column, expected);
});

Deno.test("Column.create with custom parameters", () => {
    const column = Column.create("Custom Title", "customField", DataType.NUMBER, false, 150, Alignment.RIGHT, false, SortDirection.ASC, "group1");
    const expected = {
        title: "Custom Title",
        field: "customField",
        dataType: DataType.NUMBER,
        isReadOnly: false,
        width: 150,
        align: Alignment.RIGHT,
        sortable: false,
        sortDirection: SortDirection.ASC,
        groupId: "group1",
        order: 0
    };
    assertEquals(column, expected);
});

Deno.test("Columns class - add method", () => {
    const columns = new Columns();
    columns.add("Title", "Field1", DataType.STRING, true, 200, Alignment.CENTER, true, SortDirection.ASC);

    const expected = {
        0: {
            title: "Title",
            field: "Field1",
            dataType: DataType.STRING,
            isReadOnly: true,
            width: 200,
            align: Alignment.CENTER,
            sortable: true,
            sortDirection: SortDirection.ASC,
            groupId: 0,
            order: 0
        }
    };

    const existing = columns.get();

    assertEquals(existing[0], expected[0]);
});

Deno.test("Columns class - add method with no title", () => {
    const columns = new Columns();
    const error = assertThrows(() => {
        columns.add(null, "Field1");
    });

    assertEquals(error.message, "[Column.create] Column title is required");
})

Deno.test("Columns class - add method with no field", () => {
    const columns = new Columns();
    const error = assertThrows(() => {
        columns.add("Title", null);
    });

    assertEquals(error.message, "[Column.create] Column field is required");
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

    const expected = {
        0: {
            title: "Title",
            field: "Field1",
            dataType: DataType.STRING,
            isReadOnly: true,
            width: 100,
            align: Alignment.LEFT,
            sortable: true,
            sortDirection: SortDirection.NONE,
            groupId: 0,
            order: 0
        }
    };

    assertEquals(columns.get(), expected);
    assertEquals(Object.isFrozen(columns.get()), true);
});

Deno.test("Columns class - get method with no columns", () => {
    const columns = new Columns();
    assertEquals(columns.get(), {});
});

Deno.test("Columns class - set method valid data", () => {
    const columns = new Columns();
    columns.add("Title", "Field1");

    const expected = {
        0: {
            title: "Title",
            field: "Field1",
            dataType: DataType.STRING,
            isReadOnly: true,
            width: 100,
            align: Alignment.LEFT,
            sortable: true,
            sortDirection: SortDirection.NONE,
            groupId: 0,
            order: 0
        }
    };

    assertEquals(columns.get(), expected);

    columns.set({
        0: {
            title: "Title2",
            field: "Field2",
            dataType: DataType.NUMBER,
            isReadOnly: false,
            width: 200,
            align: Alignment.CENTER,
            sortable: true,
            sortDirection: SortDirection.ASC,
            groupId: 0,
            order: 0
        }
    });

    const expected2 = {
        0: {
            title: "Title2",
            field: "Field2",
            dataType: DataType.NUMBER,
            isReadOnly: false,
            width: 200,
            align: Alignment.CENTER,
            sortable: true,
            sortDirection: SortDirection.ASC,
            groupId: 0,
            order: 0
        }
    }

    assertEquals(columns.get(), expected2);
});

Deno.test("Columns.set with invalid data types in collection", () => {
    const columns = new Columns();
    const invalidCollection = [{ title: 123, field: null }]; // Invalid data types
    assertThrows(() => columns.set(invalidCollection), Error, "Column title and field are required");
});

// Deno.test("Columns.move method - toIndex is not the last item", () => {
//     const columns = new Columns();
//     columns.add("Title1", "Field1");
//     columns.add("Title2", "Field2");
//     columns.add("Title3", "Field3");
//     columns.add("Title4", "Field4");
//     columns.add("Title5", "Field5");
//
//     columns.move(0, 3, ColumnMoveLocation.BEFORE);
//     const actual = columns.get();
//
//     assert(actual[0].title === "Title2");
//     assert(actual[1].title === "Title3");
//     assert(actual[2].title === "Title1");
//     assert(actual[3].title === "Title4");
//     assert(actual[4].title === "Title5");
// })
//
// Deno.test("Columns.move method - toIndex is the last item", () => {
//     const columns = new Columns();
//     columns.add("Title1", "Field1");
//     columns.add("Title2", "Field2");
//     columns.add("Title3", "Field3");
//     columns.add("Title4", "Field4");
//     columns.add("Title5", "Field5");
//
//     columns.move(0, 3, ColumnMoveLocation.AFTER);
//     const actual = columns.get();
//
//     assert(actual[0].title === "Title2");
//     assert(actual[1].title === "Title3");
//     assert(actual[3].title === "Title4");
//     assert(actual[2].title === "Title1");
//     assert(actual[4].title === "Title5");
// })