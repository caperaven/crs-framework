import {dragResize} from "./drag-resize.js";
import {dragMarker} from "./drag-marker.js";

const DragDropLT = Object.freeze({
    "resize"    : dragResize,
    "modifier"  : dragMarker
})

export function startDrag(event) {
    const composedPath = event.composedPath();
    const target = composedPath[0];

    if (target.id === "scroller") {
        //JHR: todo check for header drag drop;
        return;
    }

    if (DragDropLT[target.className]?.call(this, event, target)) {
        event.preventDefault();
        event.stopPropagation();
    }
}