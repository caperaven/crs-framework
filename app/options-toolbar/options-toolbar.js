export default class OptionsToolbar extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    preLoad() {
        this.setProperty("state", "off");
    }

    async selectedChanged(event) {
        console.log(event.detail);
    }

    async greet() {
        console.log("hello world")
    }
}