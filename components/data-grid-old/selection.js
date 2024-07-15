export async function addSelectionFeature(grid) {
    if (grid.selectionType == "none") return;

    await crs.call("grid_columns", "add_columns", {
        element: grid,
        columns: [
            { title: "check-box-blank", field: "_selected:selected()", width: 34, classes: ["selection"]}
        ],
    });
}

export async function markSelected(grid, cell) {
    const rowIndex = cell.parentElement.dataset.index;
    const columnIndex = Array.from(cell.parentNode.children).indexOf(cell);
    const column = grid.columns[columnIndex];

    cell.textContent = cell.textContent == "check" ? "check-box-blank" : "check";
    await grid.modifyRecord(rowIndex, column.field, cell.textContent, column.convert);
}

/**
 * Select all and deselect all function.
 * @param grid
 * @param isSelected <bool>: is the records selected or not
 * @returns {Promise<void>}
 */
export async function markAllSelected(grid, isSelected) {
    console.log(`mark all for selection: ${isSelected}`);
}