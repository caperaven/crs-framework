/**
 * Header renderer renders the column header.
 * This is normally just text but in future we can have status icons on the header.
 * For example, we can have error in the data for this column but on a row that is not visible.
 * In that case render the column text and an error icon.
 *
 * Additionally,
 * 1. Render filter icon.
 * 2. Resize icon.
 * 3. Status icon/s.
 *
 * We can also have a boolean type column for select all.
 */

import { PADDING_X, PADDING_Y } from "./constants.js";

export function renderHeader(ctx, def, column, aabb, value) {
    // 1. save the current state
    ctx.save();

    // todo: JHR: add dots at the end of the text if the text is too long
    // todo: only do this on the last render, not during scrolling to save on frames.

    // 2. set the clip region
    ctx.beginPath();
    ctx.rect(aabb.x1 + PADDING_X, aabb.y1, aabb.x2 - aabb.x1 - PADDING_X, aabb.y2 - aabb.y1);
    ctx.clip();

    const halfHeight = Math.round((aabb.y2 - aabb.y1) / 2) - 2;

    // 3. render the header
    ctx.fillText(value, aabb.x1 + PADDING_X, aabb.y2 - halfHeight);

    // 4. restore the state
    ctx.restore();
}