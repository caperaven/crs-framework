import {addColumnFeatures} from "./columns.js";

export default class KanBan extends crsbinding.classes.BindableElement {
    #columns;

    get columns() {
        return this.#columns;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.#columns = [];
        addColumnFeatures(this);
    }

    async disconnectedCallback() {
        this.#columns = null;
        await super.disconnectedCallback();
    }
}

customElements.define("kan-ban", KanBan);