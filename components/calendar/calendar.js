import {CalendarUtils} from "./calendar-utils.js";

export default class Calendar extends crs.classes.BindableElement {
    #month;
    #year;
    #dateSelected;
    #currentIndex;
    #tabHandler;
    #columns;
    #elements;
    #type;
    #keyboardActions = Object.freeze({
        "pressEnter": this.#pressEnter.bind(this),
        "pressArrowLeft": this.#pressArrowLeft.bind(this),
        "pressArrowRight": this.#pressArrowRight.bind(this),
        "pressArrowUp": this.#pressArrowUp.bind(this),
        "pressArrowDown": this.#pressArrowDown.bind(this),
    });

    #keyboardViewActions = Object.freeze({
        "defaultEnter": this.#defaultEnter.bind(this),
        "monthsEnter": this.#monthsEnter.bind(this),
        "yearsEnter": this.#yearsEnter.bind(this)
    });

    #viewLoadActions = Object.freeze({
        "yearsVisualSelection": this.#yearsVisualSelection.bind(this),
        "monthsVisualSelection": this.#monthsVisualSelection.bind(this),
        "defaultVisualSelection": this.#defaultVisualSelection.bind(this)
    });

    get shadowDom() {
        return true;
    }

    get month() {
        return this.getProperty("selectedMonth");
    }

    get year() {
        return this.getProperty("selectedYear");
    }

    get #selectedView() {
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
        await crs.binding.inflation.manager.register("calendar-cell", tplCell);

        const tplYears = this.shadowRoot.querySelector("#tplYears");
        await crs.binding.inflation.manager.register("calendar-years", tplYears);

        this.#tabHandler = this.#tabNavigation.bind(this);
        this.shadowRoot.addEventListener('keydown', this.#tabHandler);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await crs.binding.inflation.manager.unregister("calendar-cell");
        await crs.binding.inflation.manager.unregister("calendar-years");
        this.shadowRoot.removeEventListener('keydown', this.#tabHandler);
        this.#tabHandler = null;
        this.#month = null;
        this.#year = null;
        this.#dateSelected = null;
        this.#currentIndex = null;
        this.#columns = null;
        this.#elements = null;
        this.#keyboardActions = null;
        this.#keyboardViewActions = null;
        this.#viewLoadActions = null;
        this.#type = null;
    }

    async preLoad() {
        this.setProperty("selectedView", "default");
        this.setProperty("tabindex", "-1");
        await this.#setMonthProperty();
        await this.#setYearProperty();
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (newValue == null) return;
        const date = new Date(newValue);
        this.#month = date.getMonth();
        this.#year = date.getFullYear();
        await this.#setMonthProperty();
        await this.#setYearProperty();
        newValue !== oldValue && await this.#defaultVisualSelection();
    }

    /**
     * @method #render -  The function gets the data for the month and year, inflates the cells with the data, and then sets the focus on
     * the cell that was previously focused
     */
    async #render() {
        if (this.calendars == null) return;

        const data = await crs.call("date", "get_days", {month: this.#month, year: this.#year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        await crs.binding.inflation.manager.get("calendar-cell", data, cells);
        await this.#setFocusOnRender();
    }

    /**
     * @method #renderYears - The function renders the years in the calendar when switching to years view.
     */
    async #renderYears() {
        const year = new Date().getFullYear();
        const years = CalendarUtils.getYearsAround(year, -30, 30);
        const cells = this.shadowRoot.querySelectorAll("[data-type='year-cell']");
        await crs.binding.inflation.manager.get("calendar-years", years, cells);
        const element = await this.#setMonthAndYearAria(this.#year);
        element.scrollIntoView({block: 'start', behavior: 'smooth'});
        element.focus();
    }

    /**
     * @method #setMonthProperty - It sets the month text property and sets the selected month property. If the selected
     * view is months, it sets the months view.
     */
    async #setMonthProperty() {
        this.setProperty("selectedMonthText", new Date(this.#year, this.#month).toLocaleString('en-US', {month: 'long'}));
        this.setProperty("selectedMonth", this.#month);
        this.#selectedView === "months" && await this.#monthsVisualSelection();
    }

    /**
     * @method #setYearProperty - This function sets the selected year property and then sets the years view if the
     * selected view is years.
     */
    async #setYearProperty() {
        this.setProperty("selectedYearText", this.#year);
        this.setProperty("selectedYear", this.#year);
        this.#selectedView === "years" && await this.#yearsVisualSelection();
    }

    /**
     * @method #setMonthAndYearAria - This function sets the month OR year aria attributes on the selected element.
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
     * @method #setDefaultView - This function sets the selectedView property to "default"
     */
    async #setDefaultView() {
        this.setProperty("selectedView", "default");
    }

    /**
     * @method #updateTabIndex - This function sets the tab index of the current element to 0 and focuses on it and calls the
     * setDataStart function that sets the data-start attribute on the calendar.
     */
    async #updateTabIndex() {
        this.#elements[this.#currentIndex].tabIndex = 0;
        this.#elements[this.#currentIndex].focus();
        if (this.#selectedView === "default") {
            await this.#trackFocus(this.#elements[this.#currentIndex], "data-position");
            if (parseInt(this.#elements[this.#currentIndex].dataset.month) < this.#month && this.#year === parseInt(this.#elements[this.#currentIndex].dataset.year)) {
                await this.goToPrevious();
            } else if (parseInt(this.#elements[this.#currentIndex].dataset.month) > this.#month) {
                await this.goToNext();
            }

            if (parseInt(this.#elements[this.#currentIndex]?.dataset.year) < this.#year) {
                await this.goToPrevious();
            } else if (parseInt(this.#elements[this.#currentIndex]?.dataset.year) > this.#year) {
                await this.goToNext();
            }
        }
    }

    /**
     * @method #get_elements - This function gets all the elements that are focusable in the calendar and sets the current index to the element
     * that has focus.
     */
    async #get_elements() {
        this.#elements = this.shadowRoot.querySelectorAll("[role='cell'],[data-type='month-cell'],[data-type='year-cell']");
        this.#currentIndex = Array.prototype.findIndex.call(this.#elements, el => el.tabIndex === 0);
    }

    /**
     * @method #tabNavigation - This function is called when the user presses a key on the keyboard. it calls the functions
     * that correspond to the key that was pressed.
     * @param event - The event object that is passed to the function.
     * @returns the value of the expression.
     */
    async #tabNavigation(event) {
        if (event.target.tagName === "BUTTON") return;
        await this.#get_elements();
        const keys = event.key;
        if (this.#keyboardActions[`press${keys}`]) {
            keys !== 'Enter' && (this.#elements[this.#currentIndex].tabIndex = -1);
            await this.#keyboardActions[`press${keys}`](event);
        }
    }

    /**
     * @method #pressEnter - The function is called when the user presses the enter key. It calls the functions that correspond to the
     * selected view.
     * @param event
     * @return {Promise<void>}
     */
    async #pressEnter(event) {
        const view = this.#selectedView;
        if (view != null) {
            const value = parseInt(event.target.dataset.value);
            this.#keyboardViewActions[`${view}Enter`](value);
        }
    }

    /**
     * @method #pressArrowUp - The function is called when the user presses the arrow up key.
     */
    async #pressArrowUp() {
        const query = this.#currentIndex - this.#columns < 0;

        if (this.#selectedView === "default") {
            query && (await this.goToPrevious(), await this.#setFocusOnRender());
            this.#currentIndex = this.#currentIndex - this.#columns;

        } else {
            this.#currentIndex = query ? this.#currentIndex : this.#currentIndex - this.#columns;
        }
        await this.#updateTabIndex();
    }

    /**
     * @method #pressArrowDown - The function is called when the user presses the arrow down key.
     */
    async #pressArrowDown() {
        const query = (this.#currentIndex + this.#columns) >= this.#elements.length;

        if (this.#selectedView === "default") {
            query && (await this.goToNext(), await this.#setFocusOnRender());
            this.#currentIndex = this.#currentIndex + this.#columns;

        } else {
            this.#currentIndex = query ? this.#currentIndex : this.#currentIndex + this.#columns;
        }
        await this.#updateTabIndex();
    }

    /**
     * @method #pressArrowLeftt - The function is called when the user presses the arrow left key.
     */
    async #pressArrowLeft() {
        const query = (this.#currentIndex - 1) < 0;

        if (this.#selectedView === "default") {
            query && (await this.goToPrevious(), await this.#setFocusOnRender());
            this.#currentIndex = this.#currentIndex - 1;

        } else {
            this.#currentIndex = query ? this.#currentIndex : this.#currentIndex - 1;
        }
        await this.#updateTabIndex();
    }

    /**
     * @method pressArrowRight - The function is called when the user presses the arrow right key.
     */
    async #pressArrowRight() {
        this.#currentIndex = (this.#currentIndex + 1) >= this.#elements.length ? this.#currentIndex : this.#currentIndex + 1;
        await this.#updateTabIndex();
    }

    /**
     * @method #defaultEnter - It calls the `toggle_selection` method of the `dom_collection`.
     */
    async #defaultEnter() {
        await this.#setDataStart(this.#elements[this.#currentIndex]);
        await this.#setFocusOnRender();
        this.dispatchEvent(new CustomEvent("date-selected", {
            detail: {
                date: this.dataset.start
            }, bubbles: true
        }));
    }

    /**
     * @method #monthsEnter - It sets the month property to the value of the input field and calls the selectedMonthChanged function.
     * @param value - The value of the input field.
     */
    async #monthsEnter(value) {
        this.#month = value;
        await this.selectedMonthChanged(this.#month)
    }

    /**
     * > @method #yearsEnter - It sets the year property to the value of the input field and calls the selectedYearChanged function.
     * @param value - The value of the input field.
     */
    async #yearsEnter(value) {
        this.#year = value;
        await this.selectedYearChanged(this.#year);
    }

    /**
     * @method #setFocusOnRender - The function sets the year aria, focus on the element, and set the columns property.
     */
    async #yearsVisualSelection() {
        requestAnimationFrame(async () => await this.#renderYears());

        this.#columns = 4;
    }

    /**
     * @method #monthsVisualSelection - The function set the month aria, focus on the element, and set the columns property.
     */
    async #monthsVisualSelection() {
        const element = await this.#setMonthAndYearAria(this.#month);
        element.focus();
        this.#columns = 3;
    }

    /**
     * @method #defaultVisualSelection - The function renders the calendar and set the columns property.
     */
    async #defaultVisualSelection() {
        requestAnimationFrame(async () => await this.#render());
        this.#columns = 7;
    }

    async viewLoaded() {
        const view = this.#selectedView;
        if (this.#viewLoadActions[`${view}VisualSelection`]) {
            await this.#viewLoadActions[`${view}VisualSelection`]();
        }
    }

    /**
     * @method selectedMonthChanged - The function is called when the selectedMonth property changes and renders the calendar.
     * @description The function is a binding engine convention it listens for the property to change.
     * @param newValue - The new value of the selected month.
     */
    async selectedMonthChanged(newValue) {
        if (this.month !== this.#month) {
            this.#month = newValue == null || Number.parseInt(newValue) > 11 ? parseInt(this.#month) : newValue;
            await this.#setMonthProperty();
            newValue != null && await this.#setDefaultView();
        }
    }

    /**
     * @method selectedYearChanged - The function is called when the selectedYear property changes and renders the calendar.
     * @description The function is a binding engine convention it listens for the property to change.
     * @param newValue - The new value of the property.
     */
    async selectedYearChanged(newValue) {
        if (this.year !== this.#year) {
            this.#year = newValue == null || newValue.toString().length < 4 ? parseInt(this.#year) : newValue;
            await this.#setYearProperty();
            newValue != null && await this.#setDefaultView();
        }
    }

    /**
     * @method selectedDate - The function is called when a user clicks on a date in the calendar
     * @param event - The event that triggered the function.
     */
    async selectedDate(event) {
        const newValue = event.target;
        if (newValue.getAttribute("role") === 'cell') {
            await this.#setDataStart(newValue);
            await this.#setFocusOnRender();
            this.dispatchEvent(new CustomEvent("date-selected", {
                detail: {
                    date: this.dataset.start
                }, bubbles: true
            }));
        }
    }

    /**
     * @method #setDataStart - It sets the data-start attribute to the date selected by the user.
     * @param newValue - The new value of the attribute.
     *
     * @example
     * format of the date is yyyy-mm-dd
     */
    async #setDataStart(newValue) {
        this.#type = "start";
        const dateObject = new Date((new Date(newValue.dataset.year, newValue.dataset.month, newValue.dataset.day).getTime()) - ((new Date().getTimezoneOffset()) * 60 * 1000));
        this.setAttribute("data-start", dateObject.toISOString().slice(0, 10));
    }

    async #trackFocus(newValue, attribute) {
        this.#type = "position";
        const dateObject = new Date((new Date(newValue.dataset.year, newValue.dataset.month, newValue.dataset.day).getTime()) - ((new Date().getTimezoneOffset()) * 60 * 1000));
        this.calendars?.setAttribute(attribute, dateObject.toISOString().slice(0, 10));
    }

    /**
     * @method setFocusOnRender - The function gets the currently selected tab, then gets all the tabs, then sets the tabIndex of the currently
     * selected tab to -1, and the tabIndex of the newly selected tab to 0
     */
    async #setFocusOnRender() {
        const today = this.shadowRoot.querySelector(".today");
        await this.#get_elements();

        const focusElement = this.calendars.dataset.position != null && await this.#get_element(this.calendars.dataset.position);
        if (focusElement !== false && focusElement != null) {
            await this.#resetFocus(today, focusElement);
            this.#elements[this.#currentIndex] != null && focusElement != this.#elements[this.#currentIndex] ? this.#elements[this.#currentIndex].tabIndex = -1 : null;
        }

        const selectedElement = this.dataset.start != null && await this.#get_element(this.dataset.start);
        if (selectedElement !== false && selectedElement != null) {
            if (focusElement != null && focusElement !== false) {
                this.#elements[this.#currentIndex] != null && selectedElement !== this.#elements[this.#currentIndex] ? this.#elements[this.#currentIndex].tabIndex = -1 : null;
            }
            await crs.call("dom_collection", "toggle_selection", {target: selectedElement, multiple: false});
        }

        if (selectedElement != null && (focusElement == null || focusElement === false) && selectedElement !== focusElement) {
            this.#elements[this.#currentIndex] != null && selectedElement != this.#elements[this.#currentIndex] ? this.#elements[this.#currentIndex].tabIndex = -1 : null;
            await this.#resetFocus(today, selectedElement);
        }

        if ((selectedElement == null || selectedElement === false) && (focusElement === false || focusElement == null) && today == null) {
            const tab = this.shadowRoot.querySelector("[tabindex='0']");
            const element = this.shadowRoot.querySelector(`[data-month = '${this.#month}']`);
            await this.#resetFocus(tab, element);
        }

    }

    async #resetFocus(previousIndex, currentIndex) {
        previousIndex != null && (previousIndex.tabIndex = -1);
        currentIndex.tabIndex = 0;
        currentIndex.focus();
    }

    /**
     * @method #get_elements - Takes in a date object and returns and element that matches the date, month, and year.
     * @param date
     * @returns {Element}
     */
    async #get_element(data) {
        if (data == null) return;

        const date = new Date(data);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const element = this.calendars.querySelector(`[data-day= '${day}'][data-month= '${month}'][data-year= '${year}']`);

        return element;
    }

    /**
     * @method goToNext - If the selected view is years, increment the year by one. Otherwise, increment the month by one and if the month
     * is greater than 11, set the month to 0 and increment the year by one
     */
    async goToNext() {
        if (this.#selectedView === "years") {
            this.#year++;
        } else {
            this.#month++;
            this.#month > 11 && (this.#month = 0, this.#year++);
        }
        await this.#setMonthProperty();
        await this.#setYearProperty();
        await this.#render();
    }

    /**
     * @method goToPrevious - If the selected view is years, then decrement the year by one. Otherwise, decrement the month by one and if the
     * month is less than zero, then set the month to 11 and decrement the year by one
     */
    async goToPrevious() {
        if (this.#selectedView === "years") {
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