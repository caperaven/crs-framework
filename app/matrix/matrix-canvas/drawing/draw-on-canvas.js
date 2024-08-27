export function drawOnCanvas(ctx, scrollX, scrollY, gridData, columns, rows) {
    const pageDetails = gridData.getPageDetails(scrollX, scrollY, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const rowSize = gridData.rowSizes.defaultSize;

    const columnsTop = pageDetails.groups == null ? 0 : rowSize;
    const columnsBottom = ctx.canvas.offsetHeight;

    ctx.strokeStyle = "#c1c1c1";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";

    ctx.beginPath();
    const cellsTop = drawColumnHeaders(ctx, columnsTop, pageDetails, columns, rowSize);
    drawColumnLines(ctx, columnsTop, columnsBottom, pageDetails);
    drawRowLines(ctx, columnsTop, pageDetails);
    drawCells(ctx, cellsTop, pageDetails, columns, rows);
    ctx.stroke();
}

function drawColumnLines(ctx, top, bottom, pageDetails) {
    let columnX = 0;
    for (const size of pageDetails.columnsActualSizes) {
        const x = columnX + size;
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);

        columnX = x;
    }
}

function drawRowLines(ctx, top, pageDetails) {
    let rowY = top;

    for (const size of pageDetails.rowsActualSizes) {
        const y = rowY + size;
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.offsetWidth, y);

        rowY = y;
    }
}

function drawColumnHeaders(ctx, columnsTop, pageDetails, fields, defaultHeight) {
    const topY = columnsTop + (defaultHeight / 2) + 5;
    let fieldIndex = pageDetails.visibleColumns.start;

    ctx.save();
    ctx.fillStyle = "#DADADA";
    ctx.fillRect(0, 0, ctx.canvas.width, columnsTop + defaultHeight );
    ctx.restore();

    let columnX = 0;
    for (const size of pageDetails.columnsActualSizes) {
        const title = fields[fieldIndex].title;
        ctx.fillText(title, columnX + 5, topY);

        columnX += size;
        fieldIndex++;
    }

    return topY + defaultHeight;
}

function drawCells(ctx, top, pageDetails, columns, rows) {
    let rowY = top;

    let rowSizeIndex = 0;
    for (let rowIndex = pageDetails.visibleRows.start; rowIndex <= pageDetails.visibleRows.end; rowIndex++) {
        const row = rows[rowIndex];

        let columnX = 0;
        let fieldIndex = pageDetails.visibleColumns.start;

        for (const columnSize of pageDetails.columnsActualSizes) {
            const value = row[columns[fieldIndex].field];

            ctx.fillText(value, columnX + 5, rowY);

            columnX += columnSize;
            fieldIndex++;
        }

        rowY += pageDetails.rowsActualSizes[rowSizeIndex];
        rowSizeIndex++;
    }
}