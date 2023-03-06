export default class AutoComplete extends crsbinding.classes.ViewBase {
    #clickHandler = this.#click.bind(this);
    #button;
    #searchArea;

    async connectedCallback() {
        await super.connectedCallback();
        this.#button = this._element.querySelector("#btnToggle");
        this.#searchArea = this._element.querySelector("#search-area");
        this.#button.addEventListener("click", this.#clickHandler);
    }

    async disconnectedCallback() {
        this.#button.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#button = null;
        this.#searchArea = null;
    }

    async #click() {
        if (this.#searchArea.children.length > 0) {
            const numberOfChildren = this.#searchArea.children.length;
            for (let i = 0; i < numberOfChildren; i++) {
                this.#searchArea.removeChild(this.#searchArea.children[0]);
            }
        } else {
            this.#searchArea.innerHTML = '<label for="search">Search Tree</label>\n<input id="search2" class="iptSearch" type="search" placeholder="Search Tree" autocomplete="on">'
        }
    }
}