/**
 * Standard text renderer
 */

const PADDING_X = 8;
const PADDING_Y = 16;

export function renderText(ctx, def, column, aabb, value) {
    // 1. save the current state
    ctx.save();

    // 2. set the clip region
    ctx.beginPath();
    ctx.rect(aabb.x1, aabb.y1, aabb.x2 - aabb.x1 - PADDING_X, aabb.y2 - aabb.y1);
    ctx.clip();

    // 3. render the header
    ctx.fillText(value, aabb.x1 + PADDING_X, aabb.y2 - PADDING_Y);

    // 4. restore the state
    ctx.restore();

}