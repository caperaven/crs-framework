import {dates} from "./temp-data.js";

export default class Calendar extends crsbinding.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();

        const tplCell = this.shadowRoot.querySelector("#tplCell");
        await crsbinding.inflationManager.register("calendar-cell",tplCell);

        await this.#render(dates)
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await crsbinding.inflationManager.unregister("calendar-cell");
    }

    async #render(data) {
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");

        crsbinding.inflationManager.get("calendar-cell", dates, cells);
    }
}
customElements.define("calendar-component", Calendar);