import {OverlayBase} from "../overlay-base.js";

export class CellsOverlay extends OverlayBase {
    constructor(parentElement) {
        super(parentElement, "cells-overlay", import.meta.url.replace(".js", ".css"));
    }

    updatePage(def, pageDetails) {}
}