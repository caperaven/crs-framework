import "./../../components/filter-header/filter-header.js"

export default class Icons extends crs.classes.ViewBase {
    async preLoad() {
        const definition = await fetch("/resources/fonts/icons/crs-framework.json").then((response) => response.json());
        const icons = definition.selection.map(_ => _.name).sort();
        this.setProperty("icons", icons);
        this.setProperty("copyText", "Click to copy icon name.");

    }

    async copy(event) {
        const icon = event.target.dataset.tags;
        if (!icon) return;
        await crs.call("system", "copy_to_clipboard", {source: icon});
        this.setProperty("copyText", `"${icon}" copied to clipboard.`);
    }
}

