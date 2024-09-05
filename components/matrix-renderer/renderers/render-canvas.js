const LINE_COLOR = "#c1c1c1";

export function renderCanvas(ctx, def, pageDetails, scrollX, scrollY) {
    console.log(pageDetails);

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
    ctx.strokeStyle = "#c1c1c1";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign="left";
    ctx.textBaseline = "middle";
}

function clearCanvas(ctx) {
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
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

}

function drawRowLines(ctx, def, pageDetails, scrollY) {

}

function drawGroups(ctx, def, pageDetails, scrollX, scrollY) {

}