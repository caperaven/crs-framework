const LINE_COLOR = "#c1c1c1";
const CLEAR_COLOR = "#ffffff";
const TEXT_COLOR = "#000000";
const HEADER_BACKGROUND_COLOR = "#DADADA";
const FONT = "12px Arial";

export function renderCanvas(ctx, def, pageDetails, renderLT, scrollX, scrollY, isFinalRender) {
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
    const aabb = { x1: 0, x2: 0, y1: 0, y2: 0 }
    let currentRowIndex = pageDetails.visibleRows.start;

    for (let rowIndex = 0; rowIndex < pageDetails.rowsActualSizes.length; rowIndex++) {
        const row = def.rows[currentRowIndex];

        let currentFieldIndex = pageDetails.visibleColumns.start;
        for (let columnIndex  = 0; columnIndex < pageDetails.columnsActualSizes.length; columnIndex++) {
            const column = def.columns[currentFieldIndex];
            const value = row[def.columns[currentFieldIndex].field];

            setCellAABB(aabb, def, pageDetails, columnIndex, rowIndex, scrollX, scrollY);
            renderLT[column.type](ctx, def, column, aabb, value);

            currentFieldIndex++;
        }

        currentRowIndex++;
    }
}

function drawHeaders(ctx, def, pageDetails, renderLT, scrollX) {
    let columnIndex = pageDetails.visibleColumns.start;

    drawHeaderBackground(ctx, def);

    const aabb = { x1: 0, x2: 0, y1: 0, y2: 0 }

    for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
        const column = def.columns[columnIndex]
        setHeaderAABB(aabb, def, pageDetails, i, scrollX);
        renderLT["header"](ctx, def, column, aabb, column.title)
        columnIndex++;
    }
}

function drawHeaderBackground(ctx, def) {
    ctx.save();
    ctx.fillStyle = HEADER_BACKGROUND_COLOR;
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
function setHeaderAABB(aabb, def, pageDetails, columnIndex, scrollX) {
    const size = pageDetails.columnsActualSizes[columnIndex];
    const x = pageDetails.columnsCumulativeSizes[columnIndex] - scrollX - size;

    aabb.x1 = Math.ceil(x);
    aabb.x2 = Math.ceil(x + size);
    aabb.y1 = Math.ceil(def.regions.header.top);
    aabb.y2 = Math.ceil(def.regions.header.bottom);
}

function setCellAABB(aabb, def, pageDetails, columnIndex, rowIndex, scrollX, scrollY) {
    const size = pageDetails.columnsActualSizes[columnIndex];
    const x = pageDetails.columnsCumulativeSizes[columnIndex] - scrollX - size;

    const cellsTop = def.regions.cells.top;
    const halfRowHeight = def.heights.row / 2;
    const y = cellsTop + pageDetails.rowsCumulativeSizes[rowIndex] - scrollY - halfRowHeight;

    aabb.x1 = Math.ceil(x);
    aabb.x2 = Math.ceil(x + size);
    aabb.y1 = Math.ceil(y - halfRowHeight);
    aabb.y2 = Math.ceil(y + halfRowHeight);
}
