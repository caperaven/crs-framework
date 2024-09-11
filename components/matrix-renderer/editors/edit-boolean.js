export function editBoolean(ctx, def, rowIndex, column, aabb) {
    console.log(aabb)

    ctx.save()
    ctx.fillStyle = "red";
    ctx.fillRect(aabb.x1, aabb.y1, aabb.x2 - aabb.x1, aabb.y2 - aabb.y1);
    ctx.restore()
}