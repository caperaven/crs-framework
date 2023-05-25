import "../../components/calendar/calendar.js";

export default class Calendar extends crs.classes.ViewBase {
    #dateSelectedHandler = this.#setStartDate.bind(this);

    async connectedCallback() {
        await super.connectedCallback();
        await this.#initMonthTranslations();
        this.setProperty("start", new Date());
        this.#dateSelectedHandler = this.#setStartDate.bind(this);
        this.calendar.addEventListener("date-selected", this.#dateSelectedHandler);
    }

    async disconnectedCallback() {
        this.calendar.removeEventListener("date-selected", this.#dateSelectedHandler);
        this.#dateSelectedHandler = null;
        await crs.call("translations", "delete", {
            context: "calendar"
        });
        await super.disconnectedCallback();
    }

    /***
     * @method #initMonthTranslations - translations for the months for framework.
     * @return {Promise<void>}
     */
    async #initMonthTranslations() {
        await crs.call("translations", "add", {
            context: "calendar",
            translations: {
                "january": "January",
                "february": "February",
                "march": "March",
                "april": "April",
                "may": "May",
                "june": "June",
                "july": "July",
                "august": "August",
                "september": "September",
                "october": "October",
                "november": "November",
                "december": "December",
            }
        });
    }

    async #setStartDate(event) {
        this.setProperty("start", event.detail.date);
        this.dateInput.value = this.getProperty("start");
    }
}