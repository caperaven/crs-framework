import {checkForErrors} from "./hover-cell-error.js";
import {checkCellOverflow} from "./hover-cell-overflow.js";

export function hoverCells(ctx, parentElement, details) {
    const isInFrozenZone = details.offsetX < (details.def.regions.frozenColumns?.right ?? 0);

    const y = details.scrollTop + details.offsetY - details.def.regions.cells.top;
    const x = isInFrozenZone ? details.offsetX : details.offsetX + details.scrollLeft;

    const rowIndex = details.rowSizes.getIndex(y);
    const columnIndex = details.columnSizes.getIndex(x);

    if (checkForErrors(details, rowIndex, columnIndex, x, y) === true) {
        return;
    }

    if (checkCellOverflow(ctx, details, rowIndex, columnIndex) === true) {
        return;
    }
}

