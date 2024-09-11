export function setHeaderAABB(aabb, def, pageDetails, columnIndex, scrollX) {
    const size = pageDetails.columnsActualSizes[columnIndex];
    const x = pageDetails.columnsCumulativeSizes[columnIndex] - scrollX - size;

    aabb.x1 = Math.ceil(x);
    aabb.x2 = Math.ceil(x + size);
    aabb.y1 = Math.ceil(def.regions.header.top);
    aabb.y2 = Math.ceil(def.regions.header.bottom);
}