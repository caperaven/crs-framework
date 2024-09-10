/**
 * Per cell, render the boolean TRUE / FALSE state as a checked or unchecked graphic.
 * In some cases it will be a checkbox.
 * In other cases a circle with a checkmark.
 * And in other cases a switch...
 *
 * Q: How do I get the correct image for the True / False state to render.
 */

import { PADDING_X, PADDING_Y } from "./constants.js";

export function renderBoolean(ctx, def, column, aabb, value) {
    // 1. save the current state
    ctx.save();

    // 2. calculate center offset
    const center = (aabb.x2 - aabb.x1) / 2;
    const xOffset = center - 16;

    // 3. draw image on canvas.
    ctx.drawImage(def.images.boolean[value], aabb.x1 + xOffset, aabb.y1 - 1);

    // 4. restore the state
    ctx.restore();
}