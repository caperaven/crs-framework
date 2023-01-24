export default class Calendar extends crsbinding.classes.BindableElement {
    #month;
    #year;
    #dateSelected;
    #currentIndex;
    #tabHandler;
    #columns;

    get shadowDom() {
        return true;
    }

    get month() {
        return this.getProperty("selectedMonth");
    }

    get year() {
        return this.getProperty("selectedYear");
    }

    get selectedView() {
        return this.getProperty("selectedView");
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    static get observedAttributes() {
        return ["data-start"];
    }

    async load() {
        const tplCell = this.shadowRoot.querySelector("#tplCell");
        await crsbinding.inflationManager.register("calendar-cell", tplCell);
        this.#tabHandler = this.#tabNavigation.bind(this);
        if(this.perspectiveContainer) {
            this.perspectiveContainer.addEventListener('keydown', this.#tabHandler);
        }
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await crsbinding.inflationManager.unregister("calendar-cell");
        this.perspectiveContainer.removeEventListener('keydown', this.#tabHandler);
        this.#tabHandler = null;
        this.#month = null;
        this.#year = null;
        this.#dateSelected = null;
        this.#currentIndex = null;
        this.#columns = null;

    }

    async preLoad() {
        const date = new Date();
        this.#year = date.getFullYear();
        this.#month = date.getMonth();
        this.setProperty("selectedView", "default");
        await this.#setMonthProperty();
        await this.#setYearProperty();
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (!newValue) return;
        const date = new Date(newValue);
        this.#month = date.getMonth();
        this.#year = date.getFullYear();
        await this.#setMonthProperty();
        await this.#setYearProperty();
        newValue !== oldValue && await this.set_default();
    }

    async #render() {
        const data = await crs.call("date", "get_days", {month: this.#month, year: this.#year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        const date = new Date(this.dataset.start);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        for (const item of data) {
            if (item.date.getDate() === day && item.date.getMonth() === month && item.date.getFullYear() === year) {
                item.selected = true;
            }
        }
        crsbinding.inflationManager.get("calendar-cell", data, cells);
    }

    async #setMonthProperty() {
        this.setProperty("selectedMonthText", new Date(this.#year, this.#month).toLocaleString('en-US', {month: 'long'}));
        this.setProperty("selectedMonth", this.#month);
        this.selectedView === "months" && await this.set_months();
    }

    async #setYearProperty() {
        this.setProperty("selectedYearText", this.#year);
        this.setProperty("selectedYear", this.#year);
        this.selectedView === "years" && await this.set_years();
    }

    async #setMonthAndYearAria(newValue) {
        const element = this.shadowRoot.querySelector(`[data-value = '${newValue}']`);
        await crs.call("dom_collection", "toggle_selection", {target: element, multiple: false});
        element.setAttribute("tabindex", "0");
        return element;
    }

    async #set_default_view() {
        this.setProperty("selectedView", "default");
    }

    async #updateFocus(elements) {
        elements[this.#currentIndex].tabIndex = 0;
        elements[this.#currentIndex].focus();
        this.#currentIndex === 0 && await this.goToPrevious();
        this.#currentIndex === elements.length - 1 && await this.goToNext();
    }

    //Todo: implement keyboard navigation code
    async #tabNavigation(event) {
        const elements = this.perspectiveContainer.querySelectorAll("[role='cell']");
        this.#currentIndex = Array.prototype.findIndex.call(elements, el => el.tabIndex === 0);
        const keys = event.key;
        if (this[`press${keys}`]) {
            keys !== 'Enter' && (elements[this.#currentIndex].tabIndex = -1);
            await this[`press${keys}`](elements);
        }
    }

    async pressEnter() {
        console.log("enter key has been pressed");
    }

    async pressArrowUp(elements) {
        this.#currentIndex = (this.#currentIndex - this.#columns) < 0 ? elements.length - (this.#columns - this.#currentIndex) : this.#currentIndex - this.#columns;
        await this.#updateFocus(elements);
    }

    async pressArrowDown(elements) {
        this.#currentIndex = (this.#currentIndex + this.#columns) >= elements.length ? (this.#currentIndex + this.#columns) - elements.length : this.#currentIndex + this.#columns;
        await this.#updateFocus(elements);
    }

    async pressArrowLeft(elements) {
        this.#currentIndex = (this.#currentIndex - 1) < 0 ? elements.length - 1 : this.#currentIndex - 1;
        await this.#updateFocus(elements);
    }

    async pressArrowRight(elements) {
        this.#currentIndex = (this.#currentIndex + 1) % elements.length;
        await this.#updateFocus(elements);
    }

    async viewLoaded() {
        const currentView = this.selectedView;
        if (this[`set_${currentView}`]) {
            await this[`set_${currentView}`]();
        }
    }

    async set_years() {
        const element = await this.#setMonthAndYearAria(this.#year);
        element.scrollIntoView();
        this.#columns = 4;
    }

    async set_months() {
        await this.#setMonthAndYearAria(this.#month);
        this.#columns = 3;
    }

    async set_default() {
        requestAnimationFrame(async () => await this.#render());
        this.#columns = 7;
    }

    async selectedMonthChanged(newValue) {
        if (this.month !== this.#month) {
            this.#month = newValue == null || Number.parseInt(newValue) > 11 ? parseInt(this.#month) : newValue;
            await this.#setMonthProperty();
            newValue != null && await this.#set_default_view();
        }
    }

    async selectedYearChanged(newValue) {
        if (this.year !== this.#year) {
            this.#year = newValue == null || toString().length < 4 ? parseInt(this.#year) : newValue;
            await this.#setYearProperty();
            newValue != null && await this.#set_default_view();
        }
    }

    async selectedDate(event) {
        const newValue = event.target;
        if (newValue.getAttribute("role") === 'cell') {
            const dateObject = new Date((new Date(this.#year, newValue.dataset.month, newValue.dataset.day).getTime()) - ((new Date().getTimezoneOffset()) * 60 * 1000));
            await crs.call("dom_collection", "toggle_selection", {target: newValue, multiple: false});
            this.setAttribute("data-start", dateObject.toISOString().slice(0, 10));
        }
    }

    async goToNext() {
        if (this.selectedView === "years") {
            this.#year++;
        } else {
            this.#month++;
            this.#month > 11 && (this.#month = 0, this.#year++);
        }
        await this.#setMonthProperty();
        await this.#setYearProperty();
        await this.#render();
    }

    async goToPrevious() {
        if (this.selectedView === "years") {
            this.#year--;
        } else {
            this.#month--;
            this.#month < 0 && (this.#month = 11, this.#year--);
        }
        await this.#setMonthProperty();
        await this.#setYearProperty();
        await this.#render();
    }
}
customElements.define("calendar-component", Calendar);