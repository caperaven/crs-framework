import {OverlayBase} from "../overlay-base.js";
import {HeaderOverlayBuilder} from "../../../builders/header-overlay-builder.js"

export class HeaderOverlay extends OverlayBase {
    #currentCount = 1;
    #template = new HeaderOverlayBuilder().build();
    #width = 3;

    constructor(parentElement) {
        super(parentElement, "header-overlay", import.meta.url.replace(".js", ".css"));
        parentElement.appendChild(this.#template);
    }

    dispose() {
        this.#currentCount = null;
        this.#template = null;
        this.#width = null;
        return null;
    }

    #updatePositions(def, pageDetails) {
        const startIndex = this.#updateFrozenHeaders(def, pageDetails);
        this.#updateCellHeaders(def, pageDetails, startIndex);
    }

    #updateFrozenHeaders(def, pageDetails) {
        if ((def.frozenColumns?.count ?? 0) === 0) {
            return 1;
        }

        for (let i = 0; i < def.frozenColumns.count; i++) {
            const overlay = this.element.children[i + 1];
            const x = def.frozenColumns.columnsCumulativeSizes[i] - this.#width;
            const y = 0;
            overlay.style.translate = `${x}px ${y}px`;
        }

        return def.frozenColumns.count;
    }

    #updateCellHeaders(def, pageDetails) {

    }

    updatePage(def, pageDetails) {
        const count = def.frozenColumns.count + pageDetails.visibleColumns.end - pageDetails.visibleColumns.start;
        if (this.#currentCount < count) {
            createHeaderOverlays(count - this.#currentCount, this.element, this.#template);
            this.#currentCount = count;
        }

        this.element.style.setProperty("--header-height", `${def.heights.header}px`);
        this.element.style.setProperty("--header-top", `${def.regions.header.top}px`);

        this.#updatePositions(def, pageDetails);
    }
}

function createHeaderOverlays(count, parentElement, template) {
    for (let i = 0; i < count; i++) {
        const overlay = template.cloneNode(true);
        parentElement.appendChild(overlay);
    }
}