import {onKeyDown, onBlur, updateDataManager} from "../utils.js";

class MatrixTextEdit extends HTMLElement {
    #onBlurHandler = this.#onBlur.bind(this);
    #onKeyDownHandler = this.#onKeyDown.bind(this);
    #oldValue;
    #rowIndex;
    #fieldName;
    #manager;
    #input;

    get input() {
        return this.#input;
    }

    get value() {
        return this.#input.value;
    }

    set value(newValue) {
        this.#input.value = newValue;
    }

    async connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">
            ${await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text())}`

        await this.load();
    }

    async load() {
        requestAnimationFrame(() => {
            this.#input = this.querySelector("input");
            this.#input.addEventListener("blur", this.#onBlurHandler);
            this.#input.addEventListener("keydown", this.#onKeyDownHandler);

            crs.call("component", "notify_ready", { element: this });
        })
    }

    async disconnectedCallback() {
        this.#input.removeEventListener("blur", this.#onBlurHandler);
        this.#input.removeEventListener("keyup", this.#onKeyDownHandler);

        this.#input = null;
        this.#onBlurHandler = null;
        this.#onKeyDownHandler = null;
        this.#oldValue = null;
        this.#rowIndex = null;
        this.#fieldName = null;
        this.#manager = null;
    }

    #updateDataManager() {
        updateDataManager(this.value, this.#oldValue, this.#manager, this.#rowIndex, this.#fieldName);
    }

    #onBlur(event) {
        onBlur.call(this, event);
    }

    #onKeyDown(event) {
        onKeyDown(event, this.#updateDataManager.bind(this));
    }

    initialize(aabb, text, rowIndex, fieldName, manager, inputType) {
        this.#oldValue = text;
        this.#rowIndex = rowIndex;
        this.#fieldName = fieldName;
        this.#manager = manager;

        this.style.translate = `${aabb.x1 + 1}px ${aabb.y1 + 1}px`;
        this.style.width = `${aabb.x2 - aabb.x1 - 14}px`;
        this.style.height = `${aabb.y2 - aabb.y1 - 6}px`;

        crs.call("component", "on_ready", {
            element: this,
            caller: this,
            callback: async () => {
                requestAnimationFrame(() => {
                    this.value = text;
                    this.#input.type = inputType;
                    this.#input.focus();
                })
            }
        });
    }
}

customElements.define("matrix-text-editor", MatrixTextEdit);
