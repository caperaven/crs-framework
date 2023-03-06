/**
 * @function rowInflationFactory - Creates a function that inflates a row with the given columns
 * @param columns
 */
export function rowInflationFactory(columns) {
    const code = [];
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        code.push(`row.children[${i}].textContent = item["${column.property}"];`);
    }

    return new crsbinding.classes.AsyncFunction("item", "row", code.join("\n"));
}