import "./../../components/filter-header/filter-header.js"

export default class Icons extends crsbinding.classes.ViewBase {
    async preLoad(setProperty) {
        const definition = await fetch("/resources/fonts/icons/crs-framework.json").then((response) => response.json());
        const icons = definition.iconSets[0].icons.map(_ => _.tags[0]).sort();
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

