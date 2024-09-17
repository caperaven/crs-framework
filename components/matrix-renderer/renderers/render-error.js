import {ERROR_BACKGROUND_COLOR} from "./constants.js";

export function renderError(ctx, def, column, aabb) {
    ctx.save();

    ctx.fillStyle = ERROR_BACKGROUND_COLOR;
    ctx.beginPath();
    ctx.moveTo(aabb.x2 - 10, aabb.y1);
    ctx.lineTo(aabb.x2, aabb.y1);
    ctx.lineTo(aabb.x2, aabb.y1 + 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}