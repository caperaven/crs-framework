import {OverlayBase} from "../overlay-base.js";
import {setCellAABB, setFrozenAABB} from "./../../../aabb/aabb.js";
import {setCellMarker} from "./../../../dom/cell-marker.js"

export class CellsOverlay extends OverlayBase {
    #markerElement;

    constructor(parentElement) {
        super(parentElement, "cells-overlay", import.meta.url.replace(".js", ".css"));
    }

    dispose() {
        this.#markerElement = null;
        return null;
    }

    updatePage(def, pageDetails) {}

    updateSelection(def, pageDetails, scrollLeft, scrollTop, updateAABBCallback) {
        const cellAABB = { x1: 0, x2: 0, y1: 0, y2: 0 };
        const selection = pageDetails.selection;
        const visibleRowIndex = selection.row - pageDetails.visibleRows.start;
        const isInFrozenZone = selection.column < def.frozenColumns?.count ?? 0;

        if (isInFrozenZone) {
            setFrozenAABB(cellAABB, def, pageDetails, selection.column, visibleRowIndex, scrollTop);
        }
        else {
            const visibleColumnIndex = selection.column - pageDetails.visibleColumns.start;
            setCellAABB(cellAABB, def, pageDetails, visibleColumnIndex, visibleRowIndex, scrollLeft, scrollTop);
        }

        const isVisible = isMarkerVisible(def, pageDetails, cellAABB);

        const errorKey = `${selection.row},${selection.column}`;
        const hasError = def.errors?.[errorKey] != null;
        this.#markerElement = setCellMarker(this.#markerElement, this.element, cellAABB, hasError, isVisible);

        updateAABBCallback(cellAABB);
    }
}

function isMarkerVisible(def, pageDetails, aabb) {
    // 1. is the marker row visible, if not it does not matter what column it is on, don't show it.
    const isRowVisible = aabb.y1 > def.regions.cells.top && aabb.y2 < def.regions.cells.bottom;

    if (!isRowVisible) {
        return false;
    }

    // 2. is the marker on a frozen column, if so it is always visible and we don't need other checks.
    if (pageDetails.selection.column < (def.frozenColumns?.count ?? 0)) {
        return true;
    }

    if (aabb.x1 < (def.regions.frozenColumns?.right ?? 0)) {
        return false;
    }

    return true;
}