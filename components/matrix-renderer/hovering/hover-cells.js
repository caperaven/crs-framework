export function hoverCells(ctx, parentElement, details) {
    const isInFrozenZone = details.offsetX < (details.def.regions.frozenColumns?.right ?? 0);

    const y = details.scrollTop + details.offsetY - details.def.regions.cells.top;
    const x = isInFrozenZone ? details.offsetX : details.offsetX + details.scrollLeft;

    const rowIndex = details.rowSizes.getIndex(y);
    const columnIndex = details.columnSizes.getIndex(x);

    if (details.def.errors != null) {
        const error = details.def.errors[`${rowIndex},${columnIndex}`];
        if (error != null) {
            console.log(`hovered on error: ${error.message}`);
        }
    }
}