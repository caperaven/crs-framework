export function checkCellOverflow(ctx, details, rowIndex, columnIndex) {
    const row = details.def.rows[rowIndex];
    const column = details.def.columns[columnIndex];
    const value = row[column.field];
    const measurement = ctx.measureText(value);

    if (measurement.width > column.width) {
        const toolX = details.canvasAABB.left + details.offsetX;
        const toolY = details.canvasAABB.top + details.offsetY;

        crsbinding.events.emitter.emit("tooltip", {
            action: "show",
            tooltip: value,
            point: {x: toolX, y: toolY},
            duration: 3000
        })

        return true;
    }

    return false;
}