/**
 * Per cell, render the boolean TRUE / FALSE state as a checked or unchecked graphic.
 * In some cases it will be a checkbox.
 * In other cases a circle with a checkmark.
 * And in other cases a switch...
 *
 * Q: How do I get the correct image for the True / False state to render.
 */

import { PADDING_X, PADDING_Y } from "./constants.js";

export function renderGroup(ctx, def, column, aabb, value) {
    // 1. save the current state
    ctx.save();

    if (aabb.x1 < 0) {
        aabb.x1 = 0;
    }

    // 2. set the clip region
    ctx.beginPath();
    ctx.rect(aabb.x1, aabb.y1, aabb.x2 - aabb.x1 - PADDING_X, aabb.y2 - aabb.y1);
    ctx.clip();

    const halfHeight = Math.round((aabb.y2 - aabb.y1) / 2) - 2;

    // 3. render the header
    ctx.fillText(value, aabb.x1 + PADDING_X, aabb.y2 - halfHeight);

    // 4. restore the state
    ctx.restore();
}