export function drawOnCanvas(ctx, scrollX, scrollY, gridData, columns, rows) {
    // const rowSize = gridData.rowSizes.defaultSize;
    // const columnsTop = gridData.groups == null ? 0 : rowSize;
    // const columnsBottom = ctx.canvas.offsetHeight;
    // const topY = columnsTop + (rowSize / 2) + 5;
    // const cellsTop = topY + rowSize;

    const pageDetails = gridData.getPageDetails(scrollX, scrollY, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = "#c1c1c1";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";

    ctx.beginPath();
    // drawCells(ctx, pageDetails, columns, rows, scrollX, scrollY);
    drawColumnHeaders(ctx, gridData, pageDetails, columns, scrollX);
    drawColumnLines(ctx, gridData, pageDetails, scrollX);
    drawRowLines(ctx, gridData, pageDetails, scrollY);
    ctx.stroke();
}

function drawRowLines(ctx, gridData, pageDetails, scrollY) {
    const cellsTop = gridData.regions.heights.cells.top;

    for (let i = 0; i < pageDetails.rowsActualSizes.length; i++) {
        const size = pageDetails.rowsActualSizes[i];
        const y = pageDetails.rowsCumulativeSizes[i] - scrollY - size;

        if (y > cellsTop) {
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.offsetWidth, y);
        }
    }
}

function drawColumnLines(ctx, gridData, pageDetails, scrollX) {
    const top = gridData.regions.heights.cells.top;
    const bottom = gridData.regions.heights.cells.bottom;

    for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
        const size = pageDetails.columnsActualSizes[i];
        const x = pageDetails.columnsCumulativeSizes[i] - scrollX - size;

        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
    }
}

function drawColumnHeaders(ctx, gridData, pageDetails, fields, scrollX) {
    let fieldIndex = pageDetails.visibleColumns.start;

    const columnsTop = gridData.regions.heights.columns.top;
    const columnsBottom = gridData.regions.heights.columns.bottom;
    const defaultHeight = gridData.rowSizes.defaultSize;

    ctx.save();
    ctx.fillStyle = "#DADADA";
    ctx.fillRect(0, 0, ctx.canvas.width, columnsTop + defaultHeight);
    ctx.restore();

    for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
        const size = pageDetails.columnsActualSizes[i];
        const x = pageDetails.columnsCumulativeSizes[i] - scrollX - size;

        const title = fields[fieldIndex].title;
        ctx.fillText(title, x + 5, columnsBottom - 5);

        fieldIndex++;
    }
}

function drawCells(ctx, pageDetails, columns, rows, scrollX, scrollY) {
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