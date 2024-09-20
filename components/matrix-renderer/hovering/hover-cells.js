export function hoverCells(ctx, parentElement, details) {
    const isInFrozenZone = details.offsetX < (details.def.regions.frozenColumns?.right ?? 0);

    const y = details.scrollTop + details.offsetY - details.def.regions.cells.top;
    const x = isInFrozenZone ? details.offsetX : details.offsetX + details.scrollLeft;

    const rowIndex = details.rowSizes.getIndex(y);
    const columnIndex = details.columnSizes.getIndex(x);

    if (checkForErrors(details, rowIndex, columnIndex, x, y) === true) {
        return;
    }

    // place future hover checks here.
}

function checkForErrors(details, rowIndex, columnIndex, x, y) {
    if (details.def.errors != null) {
        const error = details.def.errors[`${rowIndex},${columnIndex}`];
        if (error != null) {
            const toolX = details.canvasAABB.left + details.offsetX;
            const toolY = details.canvasAABB.top + details.offsetY;

            crsbinding.events.emitter.emit("tooltip", {
                action: "show",
                tooltip: error.message,
                point: {x: toolX, y: toolY},
                styles: {
                   border: "solid 1px red",
                   color: "red"
                },
                duration: 3000
            })

            return true;
        }
    }

    return false;
}