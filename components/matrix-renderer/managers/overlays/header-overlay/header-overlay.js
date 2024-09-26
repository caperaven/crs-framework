import {OverlayBase} from "../overlay-base.js";
import {HeaderOverlayBuilder} from "../../../builders/header-overlay-builder.js"

export class HeaderOverlay extends OverlayBase {
    #currentCount = 1;
    #template;
    #width = 3;
    #settings;

    constructor(parentElement, settings) {
        super(parentElement, "header-overlay", import.meta.url.replace(".js", ".css"));
        this.#settings = settings;

        if (settings != null) {
            // the template can be null if the settings indicate that there is nothing to show
            // in that case we treat it as if there were no settings at all
            // this is important because the updatePage method will do nothing if the settings are null
            this.#template = new HeaderOverlayBuilder(this.#settings).build();

            if (this.#template == null) {
                this.#settings = null;
            }
            else {
                parentElement.appendChild(this.#template);
            }
        }
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
        if (this.#settings == null) return;

        const count = (def.frozenColumns?.count ?? 0) + pageDetails.visibleColumns.end - pageDetails.visibleColumns.start;
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