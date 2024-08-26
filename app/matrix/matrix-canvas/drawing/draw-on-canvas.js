export function drawOnCanvas(ctx, scrollX, scrollY, gridData, columns, rows) {
    const pageDetails = gridData.getPageDetails(scrollX, scrollY, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const rowSize = gridData.rowSizes.defaultSize;
    const halfRowSize = rowSize / 2;

    const columnsTop = pageDetails.groups == null ? 0 : rowSize;
    const columnsBottom = ctx.canvas.offsetHeight;
    const rowsLeft = 0;
    const rowsRight = ctx.canvas.offsetWidth;

    ctx.strokeStyle = "#DADADA";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";

    ctx.beginPath();
    drawColumnLines(ctx, columnsTop, columnsBottom, pageDetails, scrollX);
    drawRowLines(ctx, columnsTop, rowsLeft, rowsRight, pageDetails, scrollY);
    drawColumnHeaders(ctx, columnsTop + halfRowSize + 5, pageDetails, columns, scrollX);
    drawCells(ctx, ctx.canvas.offsetHeight, rowsLeft, pageDetails, columns, rows, scrollX, scrollY);
    ctx.stroke();
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
    for (const px of pageDetails.rowsCumulative) {
        if (px < 0) {
            continue;
        }

        const y = px - scrollY - top;
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
    }
}

function drawColumnHeaders(ctx, columnsTop, pageDetails, fields, scrollX, defaultHeight) {
    let fieldIndex = pageDetails.visibleColumns.start;
    let offset = 0 - scrollX;

    ctx.save();
    ctx.fillStyle = "#DADADA";
    ctx.fillRect(0, columnsTop, ctx.canvas.width, columnsTop + defaultHeight);
    ctx.restore();

    for (const cx of pageDetails.columnsCumulative) {
        const x= offset;
        const title = fields[fieldIndex].title;

        ctx.fillText(title, x + 5, columnsTop);
        offset = cx - scrollX;
        fieldIndex++;
    }
}

function drawCells(ctx, top, left, pageDetails, columns, rows, scrollX, scrollY) {
    for (let rowIndex = pageDetails.visibleRows.start; rowIndex <= pageDetails.visibleRows.end; rowIndex++) {
        const y = top - pageDetails.rowsCumulative[rowIndex] - scrollY;
        const row = rows[rowIndex];

        console.log(scrollY, y)

        let offset = 0 + scrollX;
        let fieldIndex = pageDetails.visibleColumns.start;
        for (const cx of pageDetails.columnsCumulative) {
            const x= offset;
            const field = columns[fieldIndex].field;
            const value = row[field];

            ctx.fillText(value, x + 5, y - 5);
            offset = cx - scrollX;
            fieldIndex++;
        }
    }
}