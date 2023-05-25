import {DataTableExtensions} from "../data-table-extensions.js";

/**
 * @function rowInflationFactory - Creates a function that inflates a row with the given columns
 * @param columns {Array} - The columns to inflate
 * @param idField {string} - The id field to use for the row
 */
export async function rowInflationFactory(table, columns, idField) {
    const code = [`rowElement.dataset.id = model["${idField ?? "id"}"];`];

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        code.push(`rowElement.children[${i}].textContent = model["${column.property}"];`);
    }

    await table.callExtension(DataTableExtensions.FORMATTING.name, "createFormattingCode", code);

    return new crs.classes.AsyncFunction("model", "rowElement", code.join("\n"));
}