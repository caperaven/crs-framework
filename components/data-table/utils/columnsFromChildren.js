/**
 * @function columnsFromChildren - Use the child elements of the data-table to create the columns.
 * @param children {HTMLCollection} - child elements of the data-table
 * @param columnsManager {ColumnsManager} - columns manager
 */
export function columnsFromChildren(children, columnsManager) {
    const columns = [];

    for (let child of children) {
        columns.push({
            title: child.dataset.heading,
            width: child.dataset.width,
            property: child.dataset.property
        });
    }

    columnsManager.set(columns);
}