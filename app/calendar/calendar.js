import "../../components/calendar/calendar.js";
import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class CalendarViewModel extends crs.classes.BindableElement {
    #dateSelectedHandler = this.#setStartDate.bind(this);

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async preLoad() {
        this.setProperty("start", new Date());
    }

    async load() {
        requestAnimationFrame(async () => {
            await this.#initMonthTranslations();
            this.calendar.addEventListener("date-selected", this.#dateSelectedHandler);
            await super.load();
        })
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