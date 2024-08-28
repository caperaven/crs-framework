export function drawOnCanvas(ctx, scrollX, scrollY, gridData, columns, rows) {
    const rowSize = gridData.rowSizes.defaultSize;
    const columnsTop = gridData.groups == null ? 0 : rowSize;
    const columnsBottom = ctx.canvas.offsetHeight;
    const topY = columnsTop + (rowSize / 2) + 5;
    const cellsTop = topY + rowSize;

    const pageDetails = gridData.getPageDetails(scrollX, scrollY, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = "#c1c1c1";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";

    ctx.beginPath();
    drawCells(ctx, cellsTop, pageDetails, columns, rows, scrollX, scrollY);
    drawColumnHeaders(ctx, columnsTop, pageDetails, columns, rowSize, scrollX, topY);
    drawColumnLines(ctx, columnsTop, columnsBottom, pageDetails, scrollX);
    drawRowLines(ctx, columnsTop, pageDetails, scrollY, cellsTop);
    ctx.stroke();
}

function drawRowLines(ctx, top, pageDetails, scrollY, cellsTop) {
    for (let i = 0; i < pageDetails.rowsActualSizes.length; i++) {
        const size = pageDetails.rowsActualSizes[i];
        const y = pageDetails.rowsCumulativeSizes[i] - scrollY - size;

        if (y > cellsTop) {
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.offsetWidth, y);
        }
    }
}

function drawColumnLines(ctx, top, bottom, pageDetails, scrollX) {
    for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
        const size = pageDetails.columnsActualSizes[i];
        const x = pageDetails.columnsCumulativeSizes[i] - scrollX - size;

        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
    }
}

function drawColumnHeaders(ctx, columnsTop, pageDetails, fields, defaultHeight, scrollX, topY) {
    let fieldIndex = pageDetails.visibleColumns.start;

    ctx.save();
    ctx.fillStyle = "#DADADA";
    ctx.fillRect(0, 0, ctx.canvas.width, columnsTop + defaultHeight );
    ctx.restore();

    for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
        const size = pageDetails.columnsActualSizes[i];
        const x = pageDetails.columnsCumulativeSizes[i] - scrollX - size;

        const title = fields[fieldIndex].title;
        ctx.fillText(title, x + 5, topY);

        fieldIndex++;
    }
}

function drawCells(ctx, top, pageDetails, columns, rows, scrollX, scrollY) {
    let rowIndex = pageDetails.visibleRows.start;

    for (let i = 0; i < pageDetails.rowsActualSizes.length; i++) {
        const size = pageDetails.rowsActualSizes[i];
        const y = pageDetails.rowsCumulativeSizes[i] - scrollY - size + top;
        const row = rows[rowIndex];

        let fieldIndex = pageDetails.visibleColumns.start;

        for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
            const size = pageDetails.columnsActualSizes[i];
            const x = pageDetails.columnsCumulativeSizes[i] - scrollX - size;

            const value = row[columns[fieldIndex].field];

            ctx.fillText(value, x + 5, y);
            fieldIndex++;
        }

        rowIndex++;
    }
}