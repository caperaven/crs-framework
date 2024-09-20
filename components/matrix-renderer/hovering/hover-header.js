export function hoverHeader(ctx, parentElement, details) {
    const isInFrozenZone = details.offsetX < (details.def.regions.frozenColumns?.right ?? 0);
    const x = isInFrozenZone ? details.offsetX : details.offsetX + details.scrollLeft;

    const columnIndex = details.columnSizes.getIndex(x);
    const column = details.def.columns[columnIndex];
    const measurement = ctx.measureText(column.title);

    if (measurement.width > column.width) {
        const toolX = details.canvasAABB.left + details.offsetX;
        const toolY = details.canvasAABB.top + details.offsetY;

        crsbinding.events.emitter.emit("tooltip", {
            action: "show",
            tooltip: column.title,
            point: {x: toolX, y: toolY},
            duration: 3000
        })
    }
}
