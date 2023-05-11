import "../../components/calendar/calendar.js";

export default class Calendar extends crsbinding.classes.ViewBase {
    #dateSelectedHandler;

    async connectedCallback() {
        await super.connectedCallback();
        this.setProperty("start", new Date());
        this.#dateSelectedHandler = this.#setStartDate.bind(this);
        this.calendar.addEventListener("date-selected", this.#dateSelectedHandler);
    }

    async disconnectedCallback() {
        this.calendar.removeEventListener("date-selected", this.#dateSelectedHandler);
        this.#dateSelectedHandler = null;
        await super.disconnectedCallback();
    }

    async #setStartDate(event) {
        this.setProperty("start", event.detail.date);
        this.dateInput.value = this.getProperty("start");
        event.stopPropagation();
    }
}