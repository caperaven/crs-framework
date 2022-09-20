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

    set(char) {
        if (this.stepCursor() == true && canEdit(this._mask[this._index], char)) {
            this.values[this._index] = char;
            this.text = this.values.join("");
            this._index += 1;
        }
    }
}

export function maskToText(mask) {
    return mask
        .split("0").join("_")
        .split("#").join("_")
}

export function canEdit(maskValue, char) {
    const isAlpha = isNaN(char);

    if (isAlpha == true && (maskValue == "#" || maskValue == "_")) return true;
    if (isAlpha == false && (maskValue == "#" || maskValue == "0")) return true;

    return false;
}

