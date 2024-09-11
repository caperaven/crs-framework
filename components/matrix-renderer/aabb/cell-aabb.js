export function setCellAABB(aabb, def, pageDetails, columnIndex, rowIndex, scrollX, scrollY) {
    const size = pageDetails.columnsActualSizes[columnIndex];
    const x = pageDetails.columnsCumulativeSizes[columnIndex] - scrollX - size;

    const cellsTop = def.regions.cells.top;
    const halfRowHeight = pageDetails.rowsActualSizes[rowIndex] / 2;
    const y = cellsTop + pageDetails.rowsCumulativeSizes[rowIndex] - scrollY - halfRowHeight;

    aabb.x1 = Math.ceil(x);
    aabb.x2 = Math.ceil(x + size);
    aabb.y1 = Math.ceil(y - halfRowHeight);
    aabb.y2 = Math.ceil(y + halfRowHeight);
}