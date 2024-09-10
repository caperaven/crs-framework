import { FONT, HARD_STROKE_COLOR, TEXT_COLOR, CLEAR_COLOR, HEADER_BACKGROUND_COLOR, LINE_COLOR } from "./constants.js";

export function renderCanvas(ctx, def, pageDetails, renderLT, scrollX, scrollY, isFinalRender) {
    // prepare for rendering
    clearCanvas(ctx);
    initialize(ctx);

    // render the matrix
    drawCells   (ctx, def, pageDetails, renderLT, scrollX, scrollY);
    drawHeaders (ctx, def, pageDetails, renderLT, scrollX);
    drawGroups  (ctx, def, pageDetails, renderLT, scrollX);
    drawFrozen  (ctx, def, pageDetails, renderLT, scrollY);
    drawLines   (ctx, def, pageDetails, scrollX, scrollY);
}

function initialize(ctx) {
    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.fontStyle = "normal";
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

function drawGroups(ctx, def, pageDetails, renderLT, scrollX) {
    let groupIndex = pageDetails.visibleGroups.start;
    const aabb = { x1: 0, x2: 0, y1: 0, y2: 0 }

    for (let i = 0; i < pageDetails.groupsActualSizes.length; i++) {
        const group = def.groups[groupIndex];
        setGroupAABB(aabb, def, pageDetails, i, scrollX);
        renderLT["group"](ctx, def, group, aabb, group.title);

        groupIndex++;
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
    ctx.lineWidth = 1;
    ctx.beginPath();
    drawColumnLines(ctx, def, pageDetails, scrollX);
    drawRowLines(ctx, def, pageDetails, scrollY);
    drawGroupLines(ctx, def, pageDetails, scrollX);
    ctx.stroke();
    ctx.restore();

    if (def.frozenColumns != null) {
        drawHardStrokeLines(ctx, def, pageDetails, scrollX, scrollY);
    }
}

function drawFrozen(ctx, def, pageDetails, renderLT, scrollY) {
    if (def.frozenColumns == null) {
        return;
    }

    ctx.save();

    ctx.fillStyle = CLEAR_COLOR;
    ctx.fillRect(0, def.regions.cells.top, def.regions.frozenColumns.right, def.regions.cells.bottom);

    ctx.fillStyle = TEXT_COLOR;
    drawFrozenCells(ctx, def, pageDetails, renderLT, scrollY);

    ctx.fillStyle = HEADER_BACKGROUND_COLOR;
    ctx.fillRect(0, def.regions.header.top, def.regions.frozenColumns.right, def.heights.header);

    ctx.fillStyle = TEXT_COLOR;
    drawFrozenHeaders(ctx, def, pageDetails, renderLT);

    ctx.restore();
}

function drawFrozenHeaders(ctx, def, pageDetails, renderLT) {
    const aabb = {
        x1: 0,
        x2: 0,
        y1: Math.ceil(def.regions.header.top),
        y2: Math.ceil(def.regions.header.bottom)
    }

    let x = 0;

    for (let i = 0; i < def.frozenColumns.count; i++) {
        const column = def.columns[i];
        const size = column.width;

        aabb.x1 = x;
        aabb.x2 = Math.ceil(x + size);

        renderLT["header"](ctx, def, column, aabb, column.title);
        x += size;
    }
}

function drawFrozenCells(ctx, def, pageDetails, renderLT, scrollY) {
    const aabb = { x1: 0, x2: 0, y1: 0, y2: 0 }
    let currentRowIndex = pageDetails.visibleRows.start;

    for (let rowIndex = 0; rowIndex < pageDetails.rowsActualSizes.length; rowIndex++) {
        const row = def.rows[currentRowIndex];

        for (let columnIndex  = 0; columnIndex < def.frozenColumns.count; columnIndex++) {
            const column = def.columns[columnIndex];
            const value = row[def.columns[columnIndex].field];

            setFrozenAABB(aabb, def, pageDetails, columnIndex, rowIndex, scrollY);
            renderLT[column.type](ctx, def, column, aabb, value);
        }

        currentRowIndex++;
    }
}

function drawColumnLines(ctx, def, pageDetails, scrollX) {
    const top = def.regions.header.top;
    const bottom = def.regions.cells.bottom;

    ctx.moveTo(0, 0);
    ctx.lineTo(0, bottom);

    for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
        const x = pageDetails.columnsCumulativeSizes[i] - scrollX;

        if (x < def.regions.frozenColumns.right) {
            continue;
        }

        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
    }
}

function drawRowLines(ctx, def, pageDetails, scrollY) {
    ctx.moveTo(0, 0);
    ctx.lineTo(ctx.canvas.offsetWidth, 0);

    ctx.moveTo(0, def.regions.header.top);
    ctx.lineTo(ctx.canvas.offsetWidth, def.regions.header.top);

    for (let i = 0; i < pageDetails.rowsActualSizes.length; i++) {
        const y = pageDetails.rowsCumulativeSizes[i] - scrollY + def.regions.cells.top;

        if (y > def.regions.cells.top) {
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.offsetWidth, y);
        }
    }
}

function drawGroupLines(ctx, def, pageDetails, scrollX) {
    for (let i = 0; i < pageDetails.groupsCumulativeSizes.length; i++) {
        const x = pageDetails.groupsCumulativeSizes[i] - scrollX;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, def.regions.grouping.bottom);
    }
}

function drawHardStrokeLines(ctx, def, pageDetails, scrollX, scrollY) {
    ctx.save();
    ctx.strokeStyle = HARD_STROKE_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();

    // draw frozen columns separator
    ctx.moveTo(def.regions.frozenColumns.right, def.regions.header.top);
    ctx.lineTo(def.regions.frozenColumns.right, def.regions.cells.bottom);

    ctx.stroke();
    ctx.restore();
}

function setHeaderAABB(aabb, def, pageDetails, columnIndex, scrollX) {
    const size = pageDetails.columnsActualSizes[columnIndex];
    const x = pageDetails.columnsCumulativeSizes[columnIndex] - scrollX - size;

    aabb.x1 = Math.ceil(x);
    aabb.x2 = Math.ceil(x + size);
    aabb.y1 = Math.ceil(def.regions.header.top);
    aabb.y2 = Math.ceil(def.regions.header.bottom);
}

function setGroupAABB(aabb, def, pageDetails, groupIndex, scrollX) {
    const size = pageDetails.groupsActualSizes[groupIndex];
    const x = pageDetails.groupsCumulativeSizes[groupIndex] - scrollX - size;

    aabb.x1 = Math.ceil(x);
    aabb.x2 = Math.ceil(x + size);
    aabb.y1 = Math.ceil(def.regions.grouping.top);
    aabb.y2 = Math.ceil(def.regions.grouping.bottom);
}

function setCellAABB(aabb, def, pageDetails, columnIndex, rowIndex, scrollX, scrollY) {
    const size = pageDetails.columnsActualSizes[columnIndex];
    const x = pageDetails.columnsCumulativeSizes[columnIndex] - scrollX - size;

    const cellsTop = def.regions.cells.top;
    const halfRowHeight = pageDetails.rowsActualSizes[rowIndex] / 2;
    const y = cellsTop + pageDetails.rowsCumulativeSizes[rowIndex] - scrollY - halfRowHeight;

    aabb.x1 = Math.ceil(x);
    aabb.x2 = Math.ceil(x + size);
    aabb.y1 = Math.ceil(y - halfRowHeight);
    aabb.y2 = Math.ceil(y + halfRowHeight);
}

function setFrozenAABB(aabb, def, pageDetails, columnIndex, rowIndex, scrollY) {
    const size = def.frozenColumns.columnsActualSizes[columnIndex];
    const x = def.frozenColumns.columnsCumulativeSizes[columnIndex] - size;

    const cellsTop = def.regions.cells.top;
    const halfRowHeight = pageDetails.rowsActualSizes[rowIndex] / 2;
    const y = cellsTop + pageDetails.rowsCumulativeSizes[rowIndex] - scrollY - halfRowHeight;

    aabb.x1 = Math.ceil(x);
    aabb.x2 = Math.ceil(x + size);
    aabb.y1 = Math.ceil(y - halfRowHeight);
    aabb.y2 = Math.ceil(y + halfRowHeight);
}