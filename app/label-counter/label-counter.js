import "/components/label-counter/label-counter.js"

export default class Welcome extends crs.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async changed(event) {
        this.setProperty("value", event.detail.value);
    }
}