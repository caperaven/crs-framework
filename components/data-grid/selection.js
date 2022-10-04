export async function addSelectionFeature(grid) {
    if (grid.selectionType == "none") return;

    await crs.call("grid_columns", "add_columns", {
        element: grid,
        columns: [
            { title: "uncheck", field: "_selected:selected()", width: 34, classes: ["selection"]}
        ],
    });
}

export async function markSelected(grid, cell) {
    console.log(cell);
}