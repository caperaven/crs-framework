/**
 * Standard text renderer
 */


// "10,3": "error: message"

import { PADDING_X, HEADER_BACKGROUND_COLOR, TEXT_COLOR, TEXT_Y_OFFSET } from "./constants.js";

export function renderText(ctx, def, column, aabb, value, rowIndex, columnIndex) {
    // 1. save the current state
    ctx.save();

    // 2. set the clip region
    ctx.beginPath();
    // Update the background if the column is read-only
    if (column.editable === false) {
        ctx.fillStyle = HEADER_BACKGROUND_COLOR;
        ctx.fillRect(aabb.x1, aabb.y1, aabb.x2 - aabb.x1, aabb.y2 - aabb.y1);
    }

    ctx.rect(aabb.x1, aabb.y1, aabb.x2 - aabb.x1 - PADDING_X, aabb.y2 - aabb.y1);
    ctx.clip();

    const halfHeight = Math.round((aabb.y2 - aabb.y1) / 2) - TEXT_Y_OFFSET;

    ctx.fillStyle = column.foreground ?? TEXT_COLOR;

    // 3. render the header
    ctx.fillText(value, Math.round(aabb.x1 + PADDING_X), Math.round(aabb.y2 - halfHeight));

    // 4. restore the state
    ctx.restore();
}