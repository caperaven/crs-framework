/**
 * @function columnsFromChildren - Use the child elements of the data-table to create the columns.
 * @param children {HTMLCollection} - child elements of the data-table
 * @param columnsManager {ColumnsManager} - columns manager
 */
export async function columnsFromChildren(table, columnsManager) {
    const columns = [];

    const columnElements = table.querySelectorAll("column");

    for (let columnElement of columnElements) {
        columns.push({
            title: columnElement.dataset.heading,
            width: columnElement.dataset.width,
            property: columnElement.dataset.property,
            dataType: columnElement.dataset.type || "string"
        });
    }

    columnsManager.set(columns);
}