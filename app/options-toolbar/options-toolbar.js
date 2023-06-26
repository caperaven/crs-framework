import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class OptionsToolbarViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
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