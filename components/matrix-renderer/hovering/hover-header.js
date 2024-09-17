export function hoverHeader(ctx, parentElement, details) {
    const isInFrozenZone = details.offsetX < (details.def.regions.frozenColumns?.right ?? 0);
    const x = isInFrozenZone ? details.offsetX : details.offsetX + details.scrollLeft;

    const columnIndex = details.columnSizes.getIndex(x);
    const column = details.def.columns[columnIndex];
    const measurement = ctx.measureText(column.title);

    if (measurement.width > column.width) {
        console.log(`hovered on header: ${column.title}`);
    }
}
