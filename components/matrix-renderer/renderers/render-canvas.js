const LINE_COLOR = "#c1c1c1";
const CLEAR_COLOR = "#ffffff";
const TEXT_COLOR = "#000000";
const FONT = "12px Arial";

export function renderCanvas(ctx, def, pageDetails, scrollX, scrollY) {
    // prepare for rendering
    clearCanvas(ctx);
    initialize(ctx);

    // render the matrix
    drawCells   (ctx, def, pageDetails, scrollX, scrollY);
    drawHeaders (ctx, def, pageDetails, scrollX);
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

function drawCells(ctx, def, pageDetails, scrollX, scrollY) {
}

function drawHeaders(ctx, def, pageDetails, scrollX) {
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