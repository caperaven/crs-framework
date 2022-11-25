export default class Calendar extends crsbinding.classes.BindableElement {
    #month;
    #year;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    static get observedAttributes(){
        return ["data-start"];
    }

    async connectedCallback() {
        await super.connectedCallback();
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

    async preLoad() {
        this.date = new Date();
        this.#year = this.date.getFullYear();
        this.#month = this.date.getMonth();

        this.setAttribute("data-start", this.date.toISOString());
        this.setProperty("selectedView", "default");
        await this.#setMonthProperty();
        await this.#setYearProperty();
    }

    async attributeChangedCallback(name, oldValue, newValue){
        const date = new Date(newValue);
        this.#month = date.getMonth();
        this.#year = date.getFullYear();

        await this.#setMonthProperty();
        await this.#setYearProperty();
        await this.#render();
    }

    async #render() {
        const data = await crs.call("date", "get_days", {month: this.#month, year: this.#year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        crsbinding.inflationManager.get("calendar-cell", data, cells);
    }

    async #setMonthProperty() {
        this.setProperty("month", new Date(this.#year, this.#month).toLocaleString('en-US', {month: 'long'}));
        this.setAttribute("data-month", parseInt(this.#month) + 1);
    }

    async #setYearProperty() {
        this.setProperty("year", this.#year);
        this.setAttribute("data-year", parseInt(this.#year));
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
        await crs.call("dom_collection", "toggle_selection", {
            target: newValue
        });
    }

    async selectedYearChanged(newValue) {
        this.#year = newValue.dataset.value === undefined ? this.#year = parseInt(this.#year) : parseInt(newValue.dataset.value);
        await this.#setYearProperty();
        await crs.call("dom_collection", "toggle_selection", {
            target: newValue
        });
    }

    async goToNextMonth() {
        this.#month = parseInt(this.#month) + 1;
        this.#month > 11 ? (this.#month = 0, this.#year += 1, await this.#setYearProperty()) : null;
        await this.#setMonthProperty();
        await this.#render();
    }

    async goToPreviousMonth() {
        this.#month = parseInt(this.#month) - 1;
        this.#month < 0 ? (this.#month = 11, this.#year -= 1, await this.#setYearProperty()) : null;
        await this.#setMonthProperty();
        await this.#render();
    }

}
customElements.define("calendar-component", Calendar);