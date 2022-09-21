export class MaskedInput extends HTMLInputElement {
    #maskManager;
    #updateHandler;

    async connectedCallback() {
        this.#updateHandler = this.#update.bind(this);
        this.#maskManager = new MaskManager(this.dataset.mask, this.#updateHandler);
    }

    async disconnectedCallback() {
        this.#maskManager = this.#maskManager.dispose();
    }

    #update() {

    }
}

const maskValues = Object.freeze(["0", "#", "_"]);

export class MaskManager {
    #mask;
    #text;
    #values;
    #index;
    #updateCallback;

    get value() {
        return this.#text;
    }

    get currentIndex() {
        return this.#index;
    }

    constructor(mask, updateCallback) {
        this.#mask = mask;
        this.#updateCallback = updateCallback;
        this.#text = maskToText(mask);
        this.#values = this.#text.split("");

        this.setCursor(0);
    }

    dispose() {
        this.#text = null;
        this.#values = null;
        this.#mask = null;
        return null;
    }

    /**
     * step the index until it finds a valid input
     */
    #stepCursor() {
        // we are at the end so exit
        if (this.#index == this.#mask.length) return false;

        // are we at a valid input point, if yes, exit
        const maskAt = this.#mask[this.#index];
        const validIndex = maskValues.indexOf(maskAt) != -1;
        if (validIndex == true) return true;

        // move cursor up
        this.#index += 1;
        this.#stepCursor();
        return true;
    }

    #notifyUpdate() {
        this.#text = this.#values.join("");
        this.#updateCallback?.(this.#text, this.#index);
    }

    /**
     * set the cursor position
     * @param index
     */
    setCursor(index) {
        this.#index = index;
        this.#stepCursor();
    }

    /**
     * Set the value
     * @param char
     */
    set(char) {
        // we are at the end and there is nothing left to edit so return
        if (this.#index == this.#mask.length -1 && this.#values[this.#index] != "_") return;

        // step to the next open spot and make sure that you have a valid input
        if (this.#stepCursor() == true && canEdit(this.#mask[this.#index], char)) {
            this.#values[this.#index] = char;
            this.#index += 1;

            if (this.#index >= this.#mask.length) {
                this.#index = this.#mask.length - 1;
            }

            this.#notifyUpdate();
        }
    }

    clearBack() {
        if (this.#index == 0) return;

        const moveBack = this.#values[this.#index] == "_" || maskValues.indexOf(this.#mask[this.#index]) == -1;

        if (moveBack == true) {
            this.#index -= 1;
        }

        const maskAt = this.#mask[this.#index];
        if (maskValues.indexOf(maskAt) != -1) {
            this.#values[this.#index] = "_";
            this.#notifyUpdate();
        }
        else {
            this.clearBack();
        }
    }

    clear() {
        this.#text = maskToText(this.#mask);
        this.setCursor(0);
    }
}

/**
 * Convert the mask value to a input text value to use in display
 * @param mask
 * @returns {string}
 */
export function maskToText(mask) {
    return mask
        .split("0").join("_")
        .split("#").join("_")
}

/**
 * Based on the mark, is this a valid input character or not
 * @param maskValue
 * @param char
 * @returns {boolean}
 */
export function canEdit(maskValue, char) {
    const isAlpha = isNaN(char);

    if (isAlpha == true && (maskValue == "#" || maskValue == "_")) return true;
    if (isAlpha == false && (maskValue == "#" || maskValue == "0")) return true;

    return false;
}

customElements.define("masked-input", MaskedInput, { extends: "input" });
