import {OverlayBase} from "../overlay-base.js";
import {HeaderOverlayBuilder} from "../../../builders/header-overlay-builder.js"

export class HeaderOverlay extends OverlayBase {
    #currentCount = 0;

    constructor(parentElement) {
        super(parentElement, "header-overlay", import.meta.url.replace(".js", ".css"));
    }

    updatePage(def, pageDetails) {
        const count = def.frozenColumns.count + pageDetails.visibleColumns.end - pageDetails.visibleColumns.start;
        if (this.#currentCount < count) {
            createHeaderOverlays(count - this.#currentCount, this.element);
            this.#currentCount = count;
        }

        this.element.style.setProperty("--header-height", `${def.heights.header}px`);
        this.element.style.setProperty("--header-top", `${def.regions.header.top}px`);
    }
}


function createHeaderOverlays(count, parentElement) {
    for (let i = 0; i < count; i++) {
        const overlay = new HeaderOverlayBuilder().build();
        parentElement.appendChild(overlay);
    }
}