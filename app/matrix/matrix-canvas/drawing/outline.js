export function drawOutline(ctx, scrollX, scrollY, gridData, columns, rows) {
    const pageDetails = gridData.getPageDetails(scrollX, scrollY, ctx.canvas.width, ctx.canvas.height);

    ctx.save();

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const rowSize = gridData.rowSizes.defaultSize;
    const halfRowSize = rowSize / 2;

    const columnsTop = pageDetails.groups == null ? 0 : rowSize;
    const columnsBottom = ctx.canvas.offsetHeight;
    const rowsLeft = 0;
    const rowsRight = ctx.canvas.offsetWidth;

    ctx.strokeStyle = "#DADADA";

    ctx.beginPath();
    drawColumnLines(ctx, columnsTop, columnsBottom, pageDetails, scrollX);
    drawRowLines(ctx, columnsTop, rowsLeft, rowsRight, pageDetails, scrollY);
    drawColumnHeaders(ctx, columnsTop + halfRowSize + 5, pageDetails, columns, scrollX);

    ctx.stroke();

    ctx.restore();
}

function drawColumnLines(ctx, top, bottom, pageDetails, scrollX) {
    for (const px of pageDetails.columnsCumulative) {
        if (px < 0) {
            continue;
        }

        const x= px - scrollX;
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
    }
}

function drawRowLines(ctx, top, left, right, pageDetails, scrollY) {

    ctx.moveTo(left, top);
    ctx.lineTo(right, top);

    for (const px of pageDetails.rowsCumulative) {
        if (px < 0) {
            continue;
        }

        const y = px - scrollY - top;
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
    }
}

function drawColumnHeaders(ctx, columnsTop, pageDetails, fields, scrollX) {
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";

    let fieldIndex = pageDetails.visibleColumns.start;

    let offset = 0 - scrollX;
    for (const px of pageDetails.columnsCumulative) {
        const x= offset;
        const title = fields[fieldIndex].title;

        ctx.fillText(title, x + 5, columnsTop);
        offset = px - scrollX;
        fieldIndex++;
    }
}
