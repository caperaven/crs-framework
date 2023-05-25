export default class OptionsToolbar extends crs.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    preLoad() {
        this.setProperty("state", "off");
        this.setProperty("selected", "off");
    }

    async toggleSelected(event) {
        const selected = this.getProperty("selected");
        this.setProperty("selected", selected === "on" ? "off" : "on");
    }

    async selectedChanged(event) {
        console.log(event.detail);
    }

    async greet() {
        console.log("hello world")
    }
}