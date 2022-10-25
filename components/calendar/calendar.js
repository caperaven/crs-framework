

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

        const date = new Date();
        await this.#render(date.getFullYear(),date.getMonth());
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await crsbinding.inflationManager.unregister("calendar-cell");
    }

    async #render(year,month) {
        const data = await crs.call("dates","get_days",{ month: month, year: year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        crsbinding.inflationManager.get("calendar-cell", data, cells);
    }
}
customElements.define("calendar-component", Calendar);