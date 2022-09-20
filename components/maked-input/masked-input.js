export class MaskedInput extends HTMLInputElement {
    async connectedCallback() {

    }

    async disconnectedCallback() {

    }
}

customElements.define("masked-input", MaskedInput, { extends: "input" });

const maskValues = Object.freeze(["0", "#", "_"]);

export class MaskManager {
    constructor(mask) {
        this._mask = mask;
        this.text = maskToText(mask);
        this.values = this.text.split("");

        this.setCursor(0);
    }

    /**
     * set the cursor position
     * @param index
     */
    setCursor(index) {
        this._index = index;
        this.stepCursor();
    }

    /**
     * step the index until it finds a valid input
     */
    stepCursor() {
        // we are at the end so exit
        if (this._index == this._mask.length) return false;

        // are we at a valid input point, if yes, exit
        const maskAt = this._mask[this._index];
        const validIndex = maskValues.indexOf(maskAt) != -1;
        if (validIndex == true) return true;

        // move cursor up
        this._index += 1;
        this.stepCursor();
        return true;
    }

    /**
     * Set the value
     * @param char
     */
    set(char) {
        // we are at the end and there is nothing left to edit so return
        if (this._index == this._mask.length -1 && this.values[this._index] != "_") return;

        // step to the next open spot and make sure that you have a valid input
        if (this.stepCursor() == true && canEdit(this._mask[this._index], char)) {
            this.values[this._index] = char;
            this.text = this.values.join("");
            this._index += 1;

            if (this._index >= this._mask.length) {
                this._index = this._mask.length - 1;
            }
        }
    }

    clearBack() {
        if (this._index == 0) return;

        const moveBack = this.values[this._index] == "_" || maskValues.indexOf(this._mask[this._index]) == -1;

        if (moveBack == true) {
            this._index -= 1;
        }

        const maskAt = this._mask[this._index];
        if (maskValues.indexOf(maskAt) != -1) {
            this.values[this._index] = "_";
            this.text = this.values.join("");
        }
        else {
            this.clearBack();
        }
    }

    clear() {
        this.text = maskToText(this._mask);
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

