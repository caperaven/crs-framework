import {CalendarUtils} from "./calendar-utils.js";
import {CalendarKeyboardInputManager} from "./managers/calendar-keyboard-input-manager.js";

export default class Calendar extends crsbinding.classes.BindableElement {
    #month;
    #year;
    #keyboardInputManager;
    #changeMonthHandler;
    #dateSelected;
    #viewLoadActions = Object.freeze({
        "yearsVisualSelection": this.#yearsVisualSelection.bind(this),
        "monthsVisualSelection": this.#monthsVisualSelection.bind(this),
        "defaultVisualSelection": this.#defaultVisualSelection.bind(this)
    });

    get shadowDom() {
        return true;
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

        const tplYears = this.shadowRoot.querySelector("#tplYears");
        await crsbinding.inflationManager.register("calendar-years", tplYears);

        this.#keyboardInputManager = new CalendarKeyboardInputManager(this);
        this.#changeMonthHandler = this.#changeMonth.bind(this);
        this.addEventListener("change-month", this.#changeMonthHandler);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await crsbinding.inflationManager.unregister("calendar-cell");
        await crsbinding.inflationManager.unregister("calendar-years");
        this.#month = null;
        this.#year = null;
        this.#dateSelected = null;
        this.#viewLoadActions = null;
        this.#keyboardInputManager = this.#keyboardInputManager.dispose();
        this.#changeMonthHandler = null;
        this.removeEventListener("change-month", this.#changeMonthHandler);
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

        const date = new Date(newValue);
        this.#month = date.getMonth();
        this.#year = date.getFullYear();
        await this.#setMonthProperty();
        await this.#setYearProperty();
    }

    /**
     * @method #render -  The function gets the data for the month and year, inflates the cells with the data, and then sets the focus on
     * the cell that was previously focused
     */
    async #render() {
        if (this.calendars == null) return;

        const data = await crs.call("date", "get_days", {month: this.#month, year: this.#year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        crsbinding.inflationManager.get("calendar-cell", data, cells);
        await this.#setSelection();
        await this.#setFocus();
    }

    /**
     * @method #renderYears - The function renders the years in the calendar when switching to years view.
     */
    async #renderYears() {
        const year = new Date().getFullYear();
        const years = CalendarUtils.getYearsAround(year, -30, 30);
        const cells = this.shadowRoot.querySelectorAll("[data-type='year-cell']");
        crsbinding.inflationManager.get("calendar-years", years, cells);
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
        this.selectedView === "months" && await this.#monthsVisualSelection();
    }

    /**
     * @method #setYearProperty - This function sets the selected year property and then sets the years view if the
     * selected view is years.
     */
    async #setYearProperty() {
        this.setProperty("selectedYearText", this.#year);
        this.setProperty("selectedYear", this.#year);
        this.selectedView === "years" && await this.#yearsVisualSelection();
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
     * @method #setFocusOnRender - The function sets the year aria, focus on the element, and set the columns property.
     */
    async #yearsVisualSelection() {
        requestAnimationFrame(async () => await this.#renderYears());
    }

    /**
     * @method #monthsVisualSelection - The function set the month aria, focus on the element, and set the columns property.
     */
    async #monthsVisualSelection() {
        const element = await this.#setMonthAndYearAria(this.#month);
        element.focus();
    }

    /**
     * @method #defaultVisualSelection - The function renders the calendar and set the columns property.
     */
    async #defaultVisualSelection() {
        requestAnimationFrame(async () => {
            await this.#render();
        });
    }

    async viewLoaded() {
        const view = this.selectedView;
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
        if (newValue !== this.#month) {
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
        if (newValue !== this.#year) {
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
            await this.#trackFocus(newValue);
            this.dispatchEvent(new CustomEvent("date-selected", {detail: {date: this.dataset.start}, bubbles: true}));
            await this.#setSelection(newValue);
            await this.#setFocus();
        }
    }

    async #changeMonth(event) {
        const element = event.detail;
        await this.#trackFocus(element);

        if (element.classList[0] === "non-current-day") {
            if (this.#month > parseInt(element.dataset.month) && this.#year < parseInt(element.dataset.year)) {
                await this.goToNext();
            } else if (this.#month < parseInt(element.dataset.month) && this.#year > parseInt(element.dataset.year)) {
                await this.goToPrevious();
            } else {
                this.#month > element.dataset.month ? await this.goToPrevious() : await this.goToNext();
            }
        }
        event.stopPropagation();
    }

    /**
     * @method #setDataStart - It sets the data-start attribute to the date selected by the user.
     * @param newValue - The new value of the attribute.
     *
     * @example
     * format of the date is yyyy-mm-dd
     */
    async #setDataStart(newValue) {
        const dateObject = new Date((new Date(newValue.dataset.year, newValue.dataset.month, newValue.dataset.day).getTime()) - ((new Date().getTimezoneOffset()) * 60 * 1000));
        this.setAttribute("data-start", dateObject.toISOString().slice(0, 10));
    }

    async #trackFocus(newValue) {
        const dateObject = new Date((new Date(newValue.dataset.year, newValue.dataset.month, newValue.dataset.day).getTime()) - ((new Date().getTimezoneOffset()) * 60 * 1000));
        this.calendars?.setAttribute("data-position", dateObject.toISOString().slice(0, 10));
    }

    /**
     * @method setFocusOnRender - The function gets the currently selected tab, then gets all the tabs, then sets the tabIndex of the currently
     * selected tab to -1, and the tabIndex of the newly selected tab to 0
     *
     *
     * Scenarios:
     * 1. no selection or previous focus use current date
     * 2. no current date or previous focus date ,set selected date as focused date
     * 3. changing months focus must move to new focus date and all other tab indexes must be set to -1.
     * 4. staying on the same month and changing selection, unset current focus and set it to the new selected date.
     */
    async #setFocus() {
        const elementList = this.calendars.querySelectorAll("[tabindex='0']");
        const selectedElement = this.calendars.querySelector("[aria-selected='true']");
        const currentDate = this.calendars.querySelector(".today");
        const focusDate = await this.#get_element(this.calendars.dataset.position);
        await this.#resetFocus(elementList);

        if (selectedElement == null && currentDate != null && focusDate == null) {
            await this.#changeTabIndexAndSetFocus(currentDate);
        }

        if (selectedElement == null && currentDate == null && focusDate == null) {
            const element = this.calendars.querySelector("[data-day='1']:not([class = '.non-current-day'])");
            await this.#changeTabIndexAndSetFocus(element);
        }

        if (selectedElement != null && currentDate == null && focusDate == null) {
            await this.#changeTabIndexAndSetFocus(selectedElement);
        }

        if (selectedElement != null && currentDate != null && focusDate == null) {
            await this.#changeTabIndexAndSetFocus(selectedElement);
        }

        if (selectedElement != null && currentDate != null && focusDate != null) {
            selectedElement.tabIndex = -1;
            await this.#changeTabIndexAndSetFocus(focusDate);
        }

        if (selectedElement == null && currentDate == null && focusDate != null) {
            await this.#changeTabIndexAndSetFocus(focusDate);
        }

        if (selectedElement == null && currentDate != null && focusDate != null) {
            await this.#changeTabIndexAndSetFocus(focusDate);
        }

        if (selectedElement != null && currentDate == null && focusDate != null) {
            await this.#changeTabIndexAndSetFocus(focusDate);
        }
    }

    async #changeTabIndexAndSetFocus(element) {
        element.tabIndex = 0;
        element.focus();
    }

    async #resetFocus(elements) {
        for (const element of elements) {
            element.tabIndex = -1;
        }
    }

    async #setSelection() {
        const element = await this.#get_element(this.dataset.start);
        if (element != null) {
            await crs.call("dom_collection", "toggle_selection", {target: element, multiple: false});
        }
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

        return element ? element : null;
    }

    /**
     * @method goToNext - If the selected view is years, increment the year by one. Otherwise, increment the month by one and if the month
     * is greater than 11, set the month to 0 and increment the year by one
     */
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

    /**
     * @method goToPrevious - If the selected view is years, then decrement the year by one. Otherwise, decrement the month by one and if the
     * month is less than zero, then set the month to 11 and decrement the year by one
     */
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