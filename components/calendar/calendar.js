export default class Calendar extends crsbinding.classes.BindableElement {
    #month;
    #year;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    static get observedAttributes() {
        return ["data-start"];
    }

    async connectedCallback() {
        await super.connectedCallback();
        await this.load();
    }

    async load() {
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

    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-start") {
            const oldMonth = this.#month;
            const date = new Date(newValue);
            this.#month = date.getMonth();
            this.#year = date.getFullYear();
            await this.#setMonthProperty();
            await this.#setYearProperty();
            this.#month !== oldMonth ? await this.#render() : null;
        }
    }

    async #render() {
        const data = await crs.call("date", "get_days", {month: this.#month, year: this.#year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        crsbinding.inflationManager.get("calendar-cell", data, cells);
    }

    async #setMonthProperty() {
        this.setProperty("month", new Date(this.#year, this.#month).toLocaleString('en-US', {month: 'long'}));
        this.getProperty("selectedView") === "months" ? await this.#setMonthAndYearAria(this.#month) : null;
    }

    async #setYearProperty() {
        this.setProperty("year", this.#year);
        this.getProperty("selectedView") === "years" ? await this.#setMonthAndYearAria(this.#year) : null;
    }

    async #setMonthAndYearAria(newValue) {
        const tempElement = this.shadowRoot.querySelector(`[data-value = '${newValue}']`);
        await crs.call("dom_collection", "toggle_selection", {target: tempElement, multiple: false});
        newValue === this.#year ? tempElement.scrollIntoView() : null;
    }

    async viewLoaded() {
        const currentView = this.getProperty("selectedView");

        if (currentView === "default") {
            requestAnimationFrame(async () => await this.#render());
            // this.#selectedDate != null ? await crs.call("dom_collection", "toggle_selection", {target: this.#selectedDate, multiple: false}):null;
        }
        currentView === "months" ? await this.#setMonthAndYearAria(this.#month) : null;
        currentView === "years" ? await this.#setMonthAndYearAria(this.#year) : null;
    }

    async selectMonthChanged(newValue) {
        this.#month = newValue == null || isNaN(parseInt(newValue)) || parseInt(newValue) > 11 ? parseInt(this.#month) : newValue;
        await this.#setMonthProperty();
        this.setProperty("selectMonth", this.#month);
        this.getProperty("selectedView") !== "default" ? this.setProperty("selectedView", "default") : null;
    }

    async selectYearChanged(newValue) {
        this.#year = newValue == null || isNaN(parseInt(newValue)) || newValue.toString().length < 4 ? parseInt(this.#year) : newValue;
        await this.#setYearProperty();
        this.setProperty("selectYear", this.#year);
        this.getProperty("selectedView") !== "default" ? this.setProperty("selectedView", "default") : null;
    }

    async selectedDateChanged(event) {
        const newValue = event.target;
        if (newValue.getAttribute("role") === 'cell') {
            const dateObject = newValue.dataset.date;
            await crs.call("dom_collection", "toggle_selection", {target: newValue, multiple: false});
            this.setAttribute("data-start", dateObject);
        }
    }

    async goToNext() {
        if (this.getProperty("selectedView") === "months" || this.getProperty("selectedView") === "default") {
            this.#month = parseInt(this.#month) + 1;
            this.#month > 11 ? (this.#month = 0, this.#year += 1, await this.#setYearProperty()) : this.#month;
            await this.#setMonthProperty();
        }
        if (this.getProperty("selectedView") === "years") {
            this.#year = parseInt(this.#year) + 1;
            await this.#setYearProperty();
        }
        await this.#render();
    }

    async goToPrevious() {
        if (this.getProperty("selectedView") === "months" || this.getProperty("selectedView") === "default") {
            this.#month = parseInt(this.#month) - 1;
            this.#month < 0 ? (this.#month = 11, this.#year -= 1, await this.#setYearProperty()) : this.#month;
            await this.#setMonthProperty();
        }
        if (this.getProperty("selectedView") === "years") {
            this.#year = parseInt(this.#year) - 1;
            await this.#setYearProperty();
        }
        await this.#render();
    }
}
customElements.define("calendar-component", Calendar);