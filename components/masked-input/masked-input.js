export class MaskedInput extends HTMLInputElement {
    #actions;
    #maskManager;
    #updateHandler;

    async connectedCallback() {
        this.#updateHandler = this.#update.bind(this);
        this.#maskManager = new MaskManager(this.dataset.mask, this.#updateHandler);

        this.#enableActions();
        this.#enableEvents();
    }

    async disconnectedCallback() {
        this.#actions = crsbinding.utils.disposeProperties(this.#actions);
        crsbinding.dom.disableEvents(this);
        this.#maskManager = this.#maskManager.dispose();
    }

    #enableActions() {
        this.#actions = Object.freeze({
            "ArrowLeft": this.#maskManager.moveIndexLeft.bind(this.#maskManager),
            "ArrowRight": this.#maskManager.moveIndexRight.bind(this.#maskManager),
            "Backspace": this.#maskManager.clearBack.bind(this.#maskManager)
        })
    }

    #enableEvents() {
        crsbinding.dom.enableEvents(this);
        this.registerEvent(this, "focus", this.#focus.bind(this));
        this.registerEvent(this, "keydown", this.#keydown.bind(this));
        this.registerEvent(this, "click", this.#click.bind(this));
    }

    #update(text, index) {
        this.value = text;
        this.setSelectionRange(index, index);
    }

    async #focus(event) {
        event.preventDefault();

        requestAnimationFrame(() => {
            const index = this.#maskManager.currentIndex;
            this.setSelectionRange(index, index);
        })
    }

    async #click(event) {
        if (this.selectionEnd - this.selectionStart > 1) {
            return;
        }

        event.preventDefault();

        requestAnimationFrame(() => {
            if (this.#maskManager.isFilled) {
                return this.#maskManager.setCursor(this.selectionStart);
            }

            const index = this.#maskManager.currentIndex;
            this.setSelectionRange(index, index);
        })
    }

    async #keydown(event) {
        if (event.key.toLowerCase() == "a" && event.ctrlKey == true) {
            return;
        }

        if (event.key == "Tab") {
            return;
        }

        if (event.shiftKey == true) {
            return;
        }

        event.preventDefault();

        if (event.key == " ") {
            return;
        }

        if (this.#actions[event.key] != null) {
            return this.#actions[event.key](this.selectionStart, this.selectionEnd);
        }

        if (this.selectionStart != this.selectionEnd) {
            this.#maskManager.clearBack(this.selectionStart, this.selectionEnd);
            this.selectionEnd = this.selectionStart;
        }

        if (event.key.length == 1) {
            return this.#maskManager.set(event.key);
        }
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
        if (selectionEnd - selectionStart == this.#mask.length) {
            return this.clear();
        }

        const diff = selectionEnd - selectionStart;
        if (diff > 1 && selectionStart != null && selectionEnd != null) {
            return this.clear(selectionStart, selectionEnd);
        }

        if (this.#index == 0) return;

        this.#index = selectionStart - 1;

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

customElements.define("masked-input", MaskedInput, { extends: "input" });
