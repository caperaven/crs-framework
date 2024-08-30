import "./../../components/filter-header/filter-header.js"

export default class Icons extends crsbinding.classes.ViewBase {
    async preLoad(setProperty) {
        const url = import.meta.url.replace("/app/icons/icons.js", "/resources/fonts/icons/crs-framework.json");
        const definition = await fetch(url).then((response) => response.json());
        const icons = definition.selection.map(_ => _.name).sort();
        setProperty("icons", icons);
        setProperty("copyText", "Click to copy icon name.");

    }

    async copy(event) {
        const icon = event.target.dataset.tags;
        if (!icon) return;
        await crs.call("system", "copy_to_clipboard", {source: icon});
        this.setProperty("copyText", `"${icon}" copied to clipboard.`);
    }
}

