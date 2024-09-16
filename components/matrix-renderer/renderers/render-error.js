export function renderError(ctx, def, column, aabb) {
    ctx.save();

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(aabb.x2 - 10, aabb.y1);
    ctx.lineTo(aabb.x2, aabb.y1);
    ctx.lineTo(aabb.x2, aabb.y1 + 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}