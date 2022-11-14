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

        this.#month = this.date.getMonth();
        this.#year = this.date.getFullYear();
        const tplCell = this.shadowRoot.querySelector("#tplCell");
        await crsbinding.inflationManager.register("calendar-cell", tplCell);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await crsbinding.inflationManager.unregister("calendar-cell");
        this.date = null;
        this.#month = null;
        this.#year = null;
    }

    preLoad() {
        this.date = new Date();
        const month = this.date.toLocaleString('en-US', {month: 'long'});
        const year = this.date.getFullYear();

        this.setProperty("selectedView", "default");
        this.setProperty("month", month);
        this.setProperty("year", year);
    }

    async #render() {
        const data = await crs.call("date", "get_days", {month: this.#month, year: this.#year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        crsbinding.inflationManager.get("calendar-cell", data, cells);
    }

    async viewLoaded() {
        const currentView = this.getProperty("selectedView");

        if (currentView === "default") {
            requestAnimationFrame(async () => await this.#render());
        }
    }

    async month() {
        this.setProperty("selectedView", this.getProperty("selectedView") == "months" ? "default" : "months");
    }

    async year() {
        this.setProperty("selectedView", this.getProperty("selectedView") == "years" ? "default" : "years");
    }

}
customElements.define("calendar-component", Calendar);