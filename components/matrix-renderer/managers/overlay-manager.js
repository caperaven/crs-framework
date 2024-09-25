import {HeaderOverlay, CellsOverlay} from "./overlays/overlays.js";

export const OverlayChanges = Object.freeze({
    COLUMNS   : 1,
    ROWS      : 2,
    SELECTION : 4
})

export class OverlayManager {
    #headerOverlay;
    #cellsOverlay;

    constructor(parentElement) {
        this.#headerOverlay = new HeaderOverlay(parentElement);
        this.#cellsOverlay = new CellsOverlay(parentElement);
    }

    dispose() {
        this.#headerOverlay = this.#headerOverlay.dispose();
        this.#cellsOverlay = this.#cellsOverlay.dispose();
        return null;
    }

    // The args differ from call to call so use the spread operator
    update(overlayChanges, ...args) {
        if (overlayChanges & OverlayChanges.COLUMNS) {
            this.#headerOverlay.updatePage(...args);
        }

        if (overlayChanges & OverlayChanges.ROWS) {
            this.#cellsOverlay.updatePage(...args);
        }

        if (overlayChanges & OverlayChanges.SELECTION) {
            this.#cellsOverlay.updateSelection(...args);
        }
    }
}