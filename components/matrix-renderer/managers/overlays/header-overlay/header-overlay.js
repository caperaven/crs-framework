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

    #updatePositions(def, pageDetails, scrollLeft, scrollTop) {
        const startIndex = this.#updateFrozenHeaders(def);
        this.#updateCellHeaders(def, pageDetails, startIndex, scrollLeft, scrollTop);
    }

    #updateFrozenHeaders(def) {
        if ((def.frozenColumns?.count ?? 0) === 0) {
            return 1;
        }

        for (let i = 0; i < def.frozenColumns.count; i++) {
            const overlay = this.element.children[i + 1];
            const x = def.frozenColumns.columnsCumulativeSizes[i] - this.#width;
            overlay.style.translate = `${x}px`;
            overlay.dataset.index = i;
            overlay.dataset.field = def.columns[i].field;
        }

        return def.frozenColumns.count + 1;
    }

    #updateCellHeaders(def, pageDetails, startIndex, scrollLeft, scrollTop) {
        let index = startIndex;

        for (let i = 0; i < pageDetails.columnsCumulativeSizes.length; i++) {
            const x = pageDetails.columnsCumulativeSizes[i] - scrollLeft;
            if (x <= def.regions.frozenColumns.right) {
                continue;
            }

            const overlay = this.element.children[index];
            const columnIndex = pageDetails.visibleColumns.start + i;

            overlay.style.translate = `${x - this.#width}px`;
            overlay.dataset.index = columnIndex;
            overlay.dataset.field = def.columns[columnIndex].field;
            index++;
        }
    }

    updatePage(def, pageDetails, scrollLeft, scrollTop) {
        if (this.#settings == null) return;

        const count = (def.frozenColumns?.count ?? 0) + pageDetails.visibleColumns.end - pageDetails.visibleColumns.start;
        if (this.#currentCount < count) {
            createHeaderOverlays(count - this.#currentCount, this.element, this.#template);
            this.#currentCount = count;
        }

        this.element.style.setProperty("--header-height", `${def.heights.header}px`);
        this.element.style.setProperty("--header-top", `${def.regions.header.top}px`);

        this.#updatePositions(def, pageDetails, scrollLeft, scrollTop);
    }
}

function createHeaderOverlays(count, parentElement, template) {
    for (let i = 0; i < count; i++) {
        const overlay = template.cloneNode(true);
        parentElement.appendChild(overlay);
    }
}