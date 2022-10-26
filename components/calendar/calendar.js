

export default class Calendar extends crsbinding.classes.BindableElement {
    #month;
    #year;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.#month = 9;
        this.#year = 2022;

        const tplCell = this.shadowRoot.querySelector("#tplCell");
        await crsbinding.inflationManager.register("calendar-cell",tplCell);

    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await crsbinding.inflationManager.unregister("calendar-cell");
    }

    preLoad() {
        this.setProperty("selectedView", "default");
    }

    async #render() {
        const data = await crs.call("dates","get_days",{ month: this.#month, year: this.#year, only_current: false });
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        crsbinding.inflationManager.get("calendar-cell", data, cells);
    }

    async viewLoaded() {
        console.log("view-loaded")
        const currentView = this.getProperty("selectedView");

        if (currentView === "default") {
           requestAnimationFrame(async () => await this.#render() );
        }

    }

}
customElements.define("calendar-component", Calendar);