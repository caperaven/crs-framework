const LINE_COLOR = "#c1c1c1";
const CLEAR_COLOR = "#ffffff";
const TEXT_COLOR = "#000000";
const FONT = "12px Arial";
const PADDING = 8;

export function renderCanvas(ctx, def, pageDetails, renderLT, scrollX, scrollY) {
    // prepare for rendering
    clearCanvas(ctx);
    initialize(ctx);

    // render the matrix
    drawCells   (ctx, def, pageDetails, renderLT, scrollX, scrollY);
    drawHeaders (ctx, def, pageDetails, renderLT, scrollX);
    drawLines   (ctx, def, pageDetails, scrollX, scrollY);
    drawGroups  (ctx, def, pageDetails, scrollX, scrollY);
}

function initialize(ctx) {
    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign="left";
    ctx.textBaseline = "middle";
}

function clearCanvas(ctx) {
    ctx.fillStyle = CLEAR_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawCells(ctx, def, pageDetails, renderLT, scrollX, scrollY) {
}

function drawHeaders(ctx, def, pageDetails, renderLT, scrollX) {
    let fieldIndex = pageDetails.visibleColumns.start;

    drawHeaderBackground(ctx, def);

    const aabb = { x1: 0, x2: 0, y1: 0, y2: 0 }

    for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
        setAABB(aabb, def, pageDetails, i, scrollX);
        renderLT["header"](ctx, def, def.columns[fieldIndex], aabb)
        fieldIndex++;
    }
}

function drawHeaderBackground(ctx, def) {
    ctx.save();
    ctx.fillStyle = "#DADADA";
    ctx.fillRect(0, 0, ctx.canvas.width, def.regions.header.top + def.heights.header);
    ctx.restore();
}

function drawLines(ctx, def, pageDetails, scrollX, scrollY) {
    ctx.save();
    ctx.strokeStyle = LINE_COLOR;
    ctx.beginPath();

    drawColumnLines(ctx, def, pageDetails, scrollX);
    drawRowLines(ctx, def, pageDetails, scrollY);

    ctx.stroke();
    ctx.restore();
}

function drawColumnLines(ctx, def, pageDetails, scrollX) {
    const top = def.regions.cells.top;
    const bottom = def.regions.cells.bottom;

    for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
        const x = pageDetails.columnsCumulativeSizes[i] - scrollX;

        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
    }
}

function drawRowLines(ctx, def, pageDetails, scrollY) {
    const cellsTop = def.regions.cells.top;

    for (let i = 0; i < pageDetails.rowsActualSizes.length; i++) {
        const y = pageDetails.rowsCumulativeSizes[i] - scrollY;

        if (y > cellsTop) {
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.offsetWidth, y);
        }
    }
}

function drawGroups(ctx, def, pageDetails, scrollX, scrollY) {

}

/**
 * Update the bounding box for the given column index.
 * @param aabb - existing bounding box to update
 * @param def - matrix definition
 * @param pageDetails - page details
 * @param columnIndex - current column index
 * @param scrollX - horizontal scroll position
 */
function setAABB(aabb, def, pageDetails, columnIndex, scrollX) {
    const size = pageDetails.columnsActualSizes[columnIndex];
    const x = pageDetails.columnsCumulativeSizes[columnIndex] - scrollX - size;

    aabb.x1 = x;
    aabb.x2 = x + size;
    aabb.y1 = def.regions.header.top;
    aabb.y2 = def.regions.header.bottom;
}
