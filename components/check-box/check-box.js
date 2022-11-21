class CheckBox extends HTMLInputElement {
    #clickHandler = this.#click.bind(this);

    constructor() {
        super();
    }

    get status() {
        return this.dataset.status;
    }

    set status(newValue) {
        this.dataset.status = newValue;
    }

    static get observedAttributes() { return ["data-status"]; }

    connectedCallback() {
        this.#setChecked();
        this.addEventListener("click", this.#clickHandler);
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
    }

    async attributeChangedCallback() {
        this.#setChecked();
    }

    async #click() {
        this.status = this.status  === 'indeterminate' ? true : !(this.status === 'true');
    }

    #setChecked() {
        if (this.status  === 'indeterminate') {
            this.indeterminate = true;
            this.checked = false;
            this.setAttribute("aria-checked", "mixed");
        } else {
            this.indeterminate = false;
            this.checked = this.status === 'true';
            this.setAttribute("aria-checked",  this.status);
        }
    }
}

customElements.define("check-box", CheckBox, {extends: "input"});