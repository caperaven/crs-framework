import "../../components/calendar/calendar.js";

export default class Calendar extends crsbinding.classes.ViewBase {
    #dateSelectedHandler;

    async connectedCallback() {
        await super.connectedCallback();
        this.setProperty("start", "2023-01-01");
        this.#dateSelectedHandler = this.#setStartDate.bind(this);
        this.calendar.addEventListener("date-selected", this.#dateSelectedHandler);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        this.#dateSelectedHandler = null;
        this.calendar.removeEventListener("date-selected", this.#dateSelectedHandler);
    }

    async #setStartDate(event) {
        this.setProperty("start", event.detail.date);
        this.dateInput.value = this.getProperty("start");
        event.stopPropagation();
    }
}