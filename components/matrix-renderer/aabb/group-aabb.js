export function setGroupAABB(aabb, def, pageDetails, groupIndex, scrollX) {
    const size = pageDetails.groupsActualSizes[groupIndex];
    const x = pageDetails.groupsCumulativeSizes[groupIndex] - scrollX - size;

    aabb.x1 = Math.ceil(x);
    aabb.x2 = Math.ceil(x + size);
    aabb.y1 = Math.ceil(def.regions.grouping.top);
    aabb.y2 = Math.ceil(def.regions.grouping.bottom);
}