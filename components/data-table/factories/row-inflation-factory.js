/**
 * @function rowInflationFactory - Creates a function that inflates a row with the given columns
 * @param columns {Array} - The columns to inflate
 * @param idField {string} - The id field to use for the row
 */
export function rowInflationFactory(columns, idField) {
    const code = [];
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        code.push(`rowElement.dataset.id = item["${idField ?? "id"}"];`);
        code.push(`rowElement.children[${i}].textContent = item["${column.property}"];`);
    }

    return new crsbinding.classes.AsyncFunction("item", "rowElement", code.join("\n"));
}