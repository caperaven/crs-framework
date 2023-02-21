import "../../components/calendar/calendar.js";

export default class Calendar extends crsbinding.classes.ViewBase {

    async connectedCallback() {
        await super.connectedCallback();
        this.setProperty("start", "2023-01-01");
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}