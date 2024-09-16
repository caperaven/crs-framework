import { FONT, HARD_STROKE_COLOR, TEXT_COLOR, CLEAR_COLOR, HEADER_BACKGROUND_COLOR, LINE_COLOR } from "./constants.js";
import { setCellAABB, setHeaderAABB, setGroupAABB, setFrozenAABB } from "../aabb/aabb.js";

const AABB = { x1: 0, x2: 0, y1: 0, y2: 0 }

export function renderCanvas(ctx, def, pageDetails, renderLT, scrollX, scrollY, isFinalRender) {
    // prepare for rendering
    clearCanvas(ctx);
    initialize(ctx);

    // render the matrix
    drawCells   (ctx, def, pageDetails, renderLT, scrollX, scrollY, isFinalRender);
    drawHeaders (ctx, def, pageDetails, renderLT, scrollX);
    drawGroups  (ctx, def, pageDetails, renderLT, scrollX);
    drawFrozen  (ctx, def, pageDetails, renderLT, scrollY, isFinalRender);
    drawLines   (ctx, def, pageDetails, scrollX, scrollY);
}

function initialize(ctx) {
    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = "transparent";
}

function clearCanvas(ctx) {
    ctx.fillStyle = CLEAR_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawCells(ctx, def, pageDetails, renderLT, scrollX, scrollY, isFinalRender) {
    let currentRowIndex = pageDetails.visibleRows.start;

    for (let rowIndex = 0; rowIndex < pageDetails.rowsActualSizes.length; rowIndex++) {
        const row = def.rows[currentRowIndex];

        let currentFieldIndex = pageDetails.visibleColumns.start;
        for (let columnIndex  = 0; columnIndex < pageDetails.columnsActualSizes.length; columnIndex++) {
            const column = def.columns[currentFieldIndex];
            const value = row[def.columns[currentFieldIndex].field];

            setCellAABB(AABB, def, pageDetails, columnIndex, rowIndex, scrollX, scrollY);
            renderLT[column.type](ctx, def, column, AABB, value, rowIndex, currentFieldIndex);

            addErrors(ctx, AABB, def, currentRowIndex, currentFieldIndex, renderLT)

            currentFieldIndex++;
        }

        currentRowIndex++;
    }
}

function drawHeaders(ctx, def, pageDetails, renderLT, scrollX) {
    let columnIndex = pageDetails.visibleColumns.start;

    drawHeaderBackground(ctx, def);

    for (let i = 0; i < pageDetails.columnsActualSizes.length; i++) {
        const column = def.columns[columnIndex]
        setHeaderAABB(AABB, def, pageDetails, i, scrollX);
        renderLT["header"](ctx, def, column, AABB, column.title)
        columnIndex++;
    }
}

function drawGroups(ctx, def, pageDetails, renderLT, scrollX) {
    let groupIndex = pageDetails.visibleGroups.start;

    for (let i = 0; i < pageDetails.groupsActualSizes.length; i++) {
        const group = def.groups[groupIndex];
        setGroupAABB(AABB, def, pageDetails, i, scrollX);
        renderLT["group"](ctx, def, group, AABB, group.title);

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
        drawHardStrokeLines(ctx, def);
    }
}

function drawFrozen(ctx, def, pageDetails, renderLT, scrollY, errorDetails, isFinalRender) {
    if (def.frozenColumns == null) {
        return;
    }

    ctx.save();

    ctx.fillStyle = CLEAR_COLOR;
    ctx.fillRect(0, def.regions.cells.top, def.regions.frozenColumns.right, def.regions.cells.bottom);

    ctx.fillStyle = TEXT_COLOR;
    drawFrozenCells(ctx, def, pageDetails, renderLT, scrollY, errorDetails, isFinalRender);

    ctx.fillStyle = HEADER_BACKGROUND_COLOR;
    ctx.fillRect(0, def.regions.header.top, def.regions.frozenColumns.right, def.heights.header);

    ctx.fillStyle = TEXT_COLOR;
    drawFrozenHeaders(ctx, def, pageDetails, renderLT);

    ctx.restore();
}

function drawFrozenHeaders(ctx, def, pageDetails, renderLT) {
    AABB.y1 = Math.ceil(def.regions.header.top);
    AABB.y2 = Math.ceil(def.regions.header.bottom);

    let x = 0;

    for (let i = 0; i < def.frozenColumns.count; i++) {
        const column = def.columns[i];
        const size = column.width;

        AABB.x1 = x;
        AABB.x2 = Math.ceil(x + size);

        renderLT["header"](ctx, def, column, AABB, column.title);
        x += size;
    }
}

function drawFrozenCells(ctx, def, pageDetails, renderLT, scrollY, isFinalRender) {
    let currentRowIndex = pageDetails.visibleRows.start;

    for (let rowIndex = 0; rowIndex < pageDetails.rowsActualSizes.length; rowIndex++) {
        const row = def.rows[currentRowIndex];

        for (let columnIndex  = 0; columnIndex < def.frozenColumns.count; columnIndex++) {
            const column = def.columns[columnIndex];
            const value = row[def.columns[columnIndex].field];

            setFrozenAABB(AABB, def, pageDetails, columnIndex, rowIndex, scrollY);
            renderLT[column.type](ctx, def, column, AABB, value);

            addErrors(ctx, AABB, def, currentRowIndex, columnIndex, renderLT)
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

    ctx.moveTo(0, def.regions.header.bottom);
    ctx.lineTo(ctx.canvas.offsetWidth, def.regions.header.bottom);

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

function drawHardStrokeLines(ctx, def) {
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

function addErrors(ctx, aabb, def, rowIndex, columnIndex, renderLT) {
    if (def.errors == null) return;

    const key = `${rowIndex},${columnIndex}`;

    // if there is a error for that row and column set the aabb for it
    if (def.errors[key] != null) {
        def.errors[key].aabb = structuredClone(aabb);
        renderLT["error"](ctx, null, null, aabb);
    }
}