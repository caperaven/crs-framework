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

    get isFilled() {
        return this.#values.indexOf("_") == -1;
    }

    constructor(mask, updateCallback) {
        this.#mask = mask;
        this.#updateCallback = updateCallback;
        this.#text = maskToText(mask);
        this.#values = this.#text.split("");

        this.setCursor(0);
        this.#notifyUpdate();
    }

    dispose() {
        this.#mask = null;
        this.#text = null;
        this.#values = null;
        this.#index = null;
        this.#updateCallback = null;
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
        this.#notifyUpdate();
    }

    /**
     * Set the value
     * @param char
     */
    set(char) {
        // we are at the end and there is nothing left to edit so return
        // if (this.#index == this.#mask.length -1 && this.#values[this.#index] != "_") return;
        if (this.#index == this.#mask.length) return;

        // step to the next open spot and make sure that you have a valid input
        if (this.#stepCursor() == true && canEdit(this.#mask[this.#index], char)) {
            this.#values[this.#index] = char;
            this.#index += 1;

            if (this.#index >= this.#mask.length) {
                this.#index = this.#mask.length;
            }

            this.#notifyUpdate();
        }
    }

    clearBack(selectionStart, selectionEnd) {
        selectionStart = selectionStart || this.#index;
        selectionEnd = selectionEnd || selectionStart;

        if (selectionEnd - selectionStart == this.#mask.length) {
            return this.clear();
        }

        const diff = selectionEnd - selectionStart;
        if (diff > 1 && selectionStart != null && selectionEnd != null) {
            return this.clear(selectionStart, selectionEnd);
        }

        if (this.#index == 0) return;

        this.#index = selectionStart - 1;

        const maskAt = this.#mask[this.#index];
        if (maskValues.indexOf(maskAt) != -1) {
            this.#values[this.#index] = "_";
            this.#notifyUpdate();
        }
        else {
            this.clearBack(selectionStart - 1, selectionEnd - 1);
        }
    }

    clear(start, end) {
        if (start == null) {
            this.#values = maskToText(this.#mask).split("");
            this.setCursor(0);
            return this.#notifyUpdate();
        }

        for (let i = start; i < end; i++) {
            const maskAt = this.#mask[i];
            if (maskValues.indexOf(maskAt) != -1) {
                this.#values[i] = "_"
            }
        }

        this.setCursor(start);
        this.#notifyUpdate();
    }

    moveIndexLeft() {
        if (this.#index == 0) return;

        let maskAt = this.#mask[this.#index - 1];
        if (maskValues.indexOf(maskAt) != -1) {
            this.#index -= 1;
            return this.#notifyUpdate();
        }

        for (let i = this.#index; i > 0; i--) {
            maskAt = this.#mask[i - 1];
            if (maskValues.indexOf(maskAt) != -1) {
                this.#index = i;
                break;
            }
        }

        return this.#notifyUpdate();
    }

    moveIndexRight() {
        this.#index += 1;

        if (this.#index >= this.#mask.length) {
            this.#index = this.#mask.length;
            return this.#notifyUpdate();
        }

        const maskAt = this.#mask[this.#index];
        if (maskValues.indexOf(maskAt) == -1) {
            this.moveIndexRight();
        }

        this.#notifyUpdate();
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
