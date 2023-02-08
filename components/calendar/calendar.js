export default class Calendar extends crsbinding.classes.BindableElement {
    #month;
    #year;
    #dateSelected;
    #currentIndex;
    #tabHandler;
    #columns;
    #elements;

    //Todo: do a complete name check and refactor method names to be more descriptive
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
        this.shadowRoot.addEventListener('keydown', this.#tabHandler);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await crsbinding.inflationManager.unregister("calendar-cell");
        this.shadowRoot.removeEventListener('keydown', this.#tabHandler);
        this.#tabHandler = null;
        this.#month = null;
        this.#year = null;
        this.#dateSelected = null;
        this.#currentIndex = null;
        this.#columns = null;
        this.#elements = null;
    }

    async preLoad() {
        const date = new Date();
        this.#year = date.getFullYear();
        this.#month = date.getMonth();
        this.setProperty("selectedView", "default");
        this.setProperty("tabindex", "-1");
        await this.#setMonthProperty();
        await this.#setYearProperty();
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (!newValue) return;
        const currentMonth = this.#month;
        const date = new Date(newValue);
        this.#month = date.getMonth();
        this.#year = date.getFullYear();
        await this.#setMonthProperty();
        await this.#setYearProperty();
        (newValue !== oldValue) && await this.set_default();
    }

    /**
     * @method Get the data for the month and year, then inflate the cells with the data.
     * @description This method is called when the month or year is changed and renders the calendar.
     */
    async #render() {
        const data = await crs.call("date", "get_days", {month: this.#month, year: this.#year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        await this.#setAriaSelectedAttribute(data);
        crsbinding.inflationManager.get("calendar-cell", data, cells);
        await this.setFocusOnRender();
    }

    /**
     * @method It sets the aria-selected attribute of the date that was clicked when render is called.
     * @param data {object} - The {data} that is passed to the calendar.
     */
    async #setAriaSelectedAttribute(data) {
        const date = new Date(this.dataset.start);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        for (const item of data) {
            if (item.date.getDate() === day && item.date.getMonth() === month && item.date.getFullYear() === year) {
                item.selected = true;
                item.tabindex = 0;
            }
        }
    }

    /**
     * @method It sets the month text property and sets the selected month property. If the selected view is months, it
     * sets the months view and renders the calendar.
     */
    async #setMonthProperty() {
        this.setProperty("selectedMonthText", new Date(this.#year, this.#month).toLocaleString('en-US', {month: 'long'}));
        this.setProperty("selectedMonth", this.#month);
        this.selectedView === "months" && await this.set_months();
    }

    /**
     * @method This function sets the selected year property and then sets the years view if the selected view is years and
     * renders the calendar.
     */
    async #setYearProperty() {
        this.setProperty("selectedYearText", this.#year);
        this.setProperty("selectedYear", this.#year);
        this.selectedView === "years" && await this.set_years();
    }

    /**
     * @method This function sets the month OR year aria attributes on the selected element.
     * @param newValue - The value of the month or year you want to select.
     * @returns The element that was selected.
     */
    async #setMonthAndYearAria(newValue) {
        const element = this.shadowRoot.querySelector(`[data-value = '${newValue}']`);
        await crs.call("dom_collection", "toggle_selection", {target: element, multiple: false});
        element.setAttribute("tabindex", "0");
        return element;
    }

    /**
     * @method This function sets the selectedView property to "default"
     */
    async #set_default_view() {
        this.setProperty("selectedView", "default");
    }

    /**
     * @method When the user presses the tab key, the focus moves to the next element in the list.
     */
    async #updateFocus() {
        await crs.call("dom_collection", "toggle_selection", {
            target: this.#elements[this.#currentIndex],
            multiple: false
        });
        this.#elements[this.#currentIndex].tabIndex = 0;
        this.#elements[this.#currentIndex].focus();
        this.selectedView ==="default" && await this.set_dataStart(this.#elements[this.#currentIndex]);
    }

    /**
     * @method The function gets all the elements with the role of cell, or the data-type of month-cell or year-cell, and then
     * sets the currentIndex to the index of the element with the tabIndex of 0
     */
    async #get_elements() {
        this.#elements = this.shadowRoot.querySelectorAll("[role='cell'],[data-type='month-cell'],[data-type='year-cell']");
        this.#currentIndex = Array.prototype.findIndex.call(this.#elements, el => el.tabIndex === 0);
    }

    /**
     * @method This function is called when the user presses the tab key. It gets the elements, then checks if the target is a button and if it is, it returns.
     * If the target is not a button, it checks if the key pressed is a function and if it is, it calls the function.
     * @param event {object} - The event object that is passed to the function.
     * @returns the value of the expression on the right side of the return statement.
     */
    async #tabNavigation(event) {
        if (event.target.tagName === "BUTTON") return;
        await this.#get_elements();
        const keys = event.key;
        if (this[`press${keys}`]) {
            keys !== 'Enter' && (this.#elements[this.#currentIndex].tabIndex = -1);
            await this[`press${keys}`](event);
        }
    }

    /**
     * @method The function is called when the user presses the enter key. It calls the selectedDate function, which is the
     * function that is called when the user clicks on a date
     * @param event - The event that triggered the function.
     */
    async pressEnter(event) {
        //Todo:Enter selection of month and year functionality
    }

    /**
     * @method The function is called when the user presses the arrow up key.
     */
    async pressArrowUp(event) {
        this.#currentIndex = (this.#currentIndex - this.#columns) < 0 ? this.#elements.length - (this.#columns - this.#currentIndex) : this.#currentIndex - this.#columns;
        await this.#updateFocus();
    }

    /**
     * @method The function is called when the user presses the arrow down key.
     */
    async pressArrowDown(event) {
        this.#currentIndex = (this.#currentIndex + this.#columns) >= this.#elements.length ? (this.#currentIndex + this.#columns) - this.#elements.length : this.#currentIndex + this.#columns;
        await this.#updateFocus();
    }

    /**
     * @method The function is called when the user presses the arrow left key.
     */
    async pressArrowLeft(event) {
        this.#currentIndex = (this.#currentIndex - 1) < 0 ? this.#elements.length - 1 : this.#currentIndex - 1;
        await this.#updateFocus();
    }

    /**
     * @method The function is called when the user presses the arrow right key.
     */
    async pressArrowRight(event) {
        this.#currentIndex = (this.#currentIndex + 1) % this.#elements.length;
        await this.#updateFocus();
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

    /**
     * @function The function is called when the selectedMonth property changes and renders the calendar.
     * @param newValue - The new value of the selected month.
     */
    async selectedMonthChanged(newValue) {
        if (this.month !== this.#month) {
            this.#month = newValue == null || Number.parseInt(newValue) > 11 ? parseInt(this.#month) : newValue;
            await this.#setMonthProperty();
            newValue != null && await this.#set_default_view();
        }
    }

    /**
     * @function The function is called when the selectedYear property changes and renders the calendar.
     * @param newValue - The new value of the property.
     */
    async selectedYearChanged(newValue) {
        if (this.year !== this.#year) {
            this.#year = newValue == null || newValue.toString().length < 4 ? parseInt(this.#year) : newValue;
            await this.#setYearProperty();
            newValue != null && await this.#set_default_view();
        }
    }

    /**
     * @function The function is called when a user clicks on a date in the calendar
     * @param event - The event that triggered the function.
     */
    async selectedDate(event) {
        const newValue = event.target;
        if (newValue.getAttribute("role") === 'cell') {
            await crs.call("dom_collection", "toggle_selection", {target: newValue, multiple: false});
            await this.set_dataStart(newValue);
            await this.setFocusOnRender();
        }
    }

    /**
     * @function It sets the data-start attribute to the date selected by the user.
     * @param newValue - The new value of the attribute.
     */
    async set_dataStart(newValue) {
        const dateObject = new Date((new Date(newValue.dataset.year,newValue.dataset.month,newValue.dataset.day).getTime()) - ((new Date().getTimezoneOffset()) * 60 * 1000));
        this.setAttribute("data-start", dateObject.toISOString().slice(0, 10));
    }

    /**
     * @function The function gets the currently selected tab, then gets all the tabs, then sets the tabIndex of the currently
     * selected tab to -1, and the tabIndex of the newly selected tab to 0
     */
    async setFocusOnRender() {
        const element = this.shadowRoot.querySelector("[aria-selected='true']");
        if (element) {
            await this.#get_elements();
            this.#elements[this.#currentIndex].tabIndex = -1;
            element.tabIndex = 0;
            element.focus();
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