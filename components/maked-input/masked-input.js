export class MaskedInput extends HTMLInputElement {
    async connectedCallback() {

    }

    async disconnectedCallback() {

    }
}

customElements.define("masked-input", MaskedInput, { extends: "input" });

export class MaskManager {
    constructor(mask) {
        this._mask = mask;
        this.text = maskToText(mask);
    }
}

function maskToText(mask) {
    return mask
        .split("0").join("_")
        .split("#").join("_")
}

