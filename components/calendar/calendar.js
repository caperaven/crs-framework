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
        this.#year = this.date.getFullYear();

        this.setProperty("selectedView", "default");
        this.setProperty("month", this.date.toLocaleString('en-US', {month: 'long'}));
        this.setProperty("year", this.#year);
    }

    async #render() {
        const data = await crs.call("date", "get_days", {month: this.#month, year: this.#year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        crsbinding.inflationManager.get("calendar-cell", data, cells);
    }

    async #setMonthProperty() {
        this.setProperty("month", new Date(this.#year, this.#month).toLocaleString('en-US', {month: 'long'}));
    }

    async viewLoaded() {
        const currentView = this.getProperty("selectedView");

        if (currentView === "default") {
            requestAnimationFrame(async () => await this.#render());
        }
    }

    async selectedMonthChanged(newValue) {
        this.#month = newValue.dataset.value === undefined ? this.#month = this.#month : newValue.dataset.value;
        await this.#setMonthProperty();
    }

    async selectedYearChanged(newValue) {
        this.#year = newValue.dataset.value === undefined ? this.#year = this.#year : newValue.dataset.value;
        this.setProperty("year", this.#year);
    }

    async month() {
        this.setProperty("selectedView", this.getProperty("selectedView") === "months" ? "default" : "months");
    }

    async year() {
        this.setProperty("selectedView", this.getProperty("selectedView") == "years" ? "default" : "years");
    }

    async goToNextMonth() {
        this.#month = parseInt(this.#month) + 1;
        this.#month > 11 ? (this.#month = 0, this.#year += 1, this.setProperty("year", this.#year)) : null;
        await this.#setMonthProperty();
        await this.#render();
    }

    async goToPreviousMonth() {
        this.#month = parseInt(this.#month) - 1;
        this.#month < 0 ? (this.#month = 11, this.#year -= 1, this.setProperty("year", this.#year)) : null;
        await this.#setMonthProperty();
        await this.#render();
    }
}
customElements.define("calendar-component", Calendar);