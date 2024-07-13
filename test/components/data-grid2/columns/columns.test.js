import {Columns} from "./../../../../components/data-grid2/columns/columns.js";
import {Column} from "./../../../../components/data-grid2/columns/column.js";
import {Alignment} from "./../../../../components/data-grid2/columns/enums/alignment.js";
import {SortDirection} from "./../../../../components/data-grid2/columns/enums/sort-direction.js";
import {DataType} from "./../../../../components/data-grid2/columns/enums/data-type.js";
import {ConversionType} from "./../../../../components/data-grid2/columns/enums/conversion-type.js";
import { assertThrows, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { ElementMock } from "../../../mockups/element-mock.js";

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
        groupId: null
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
        groupId: "group1"
    };
    assertEquals(column, expected);
});

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

Deno.test("Columns class - set method valid data", () => {
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

Deno.test("Columns.set with invalid data types in collection", () => {
    const columns = new Columns();
    const invalidCollection = [{ title: 123, field: null }]; // Invalid data types
    assertThrows(() => columns.set(invalidCollection), Error, "Column title and field are required");
});