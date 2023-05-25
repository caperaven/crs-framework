import "../../components/calendar/calendar.js";

export default class Calendar extends crs.classes.ViewBase {
    #dateSelectedHandler = this.#setStartDate.bind(this);

    async connectedCallback() {
        await super.connectedCallback();
    }

    async preLoad() {
        this.setProperty("start", "2023-01-15");
    }

    async load() {
        requestAnimationFrame(() => {
            this.calendar.addEventListener("date-selected", this.#dateSelectedHandler);
            super.load();
        })
    }

    async disconnectedCallback() {
        this.calendar.removeEventListener("date-selected", this.#dateSelectedHandler);
        this.#dateSelectedHandler = null;
        await super.disconnectedCallback();
    }

    async #setStartDate(event) {
        this.setProperty("start", event.detail.date);
        this.dateInput.value = this.getProperty("start");
    }
}