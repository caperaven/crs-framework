class FilterInput extends HTMLInputElement {
    #changeHandler = this.#change.bind(this);
    #target;

    async connectedCallback() {
        this.addEventListener("keyup", this.#changeHandler);
        await this.load();
    }

    async load() {
        this.#target = document.querySelector(`#${this.dataset.for}`);
    }

    async disconnectedCallback() {
        this.removeEventListener("keyup", this.#changeHandler);
        this.#changeHandler = null;
        this.#target = null;
    }

    #change(event) {
        this.#target.setAttribute("data-filter", event.target.value);
    }
}

customElements.define("filter-input", FilterInput, {extends: "input"});