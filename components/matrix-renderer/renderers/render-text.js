/**
 * Standard text renderer
 */

import { PADDING_X, PADDING_Y, HEADER_BACKGROUND_COLOR } from "./constants.js";

export function renderText(ctx, def, column, aabb, value) {
    // 1. save the current state
    ctx.save();

    // 2. set the clip region
    ctx.beginPath();

    // Update the background if the column is read-only
    if (column.editable === false) {
        const currentFillStyle = ctx.fillStyle;
        ctx.fillStyle = HEADER_BACKGROUND_COLOR;
        ctx.fillRect(aabb.x1, aabb.y1, aabb.x2 - aabb.x1, aabb.y2 - aabb.y1);
        ctx.fillStyle = currentFillStyle;
    }

    ctx.rect(aabb.x1, aabb.y1, aabb.x2 - aabb.x1 - PADDING_X, aabb.y2 - aabb.y1);
    ctx.clip();

    const halfHeight = Math.round((aabb.y2 - aabb.y1) / 2) - 2;

    // 3. render the header
    ctx.fillText(value, aabb.x1 + PADDING_X, aabb.y2 - halfHeight);

    // 4. restore the state
    ctx.restore();

}