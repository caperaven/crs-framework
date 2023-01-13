import "../../components/calendar/calendar.js";

export default class Calendar extends crsbinding.classes.ViewBase {

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

    async getStartDate() {
        this.setProperty("start", this.calendar.dataset.start);
    }

    async setStartDate() {
        const selectedDate =  this.dateInput.value;
        this.calendar.dataset.start = selectedDate;
    }
}