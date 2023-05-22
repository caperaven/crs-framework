import "./../../components/tab-list/tab-list.js";

export default class TabList extends crs.binding.classes.ViewBase {
    get html() {
        return import.meta.url;
    }

    async preLoad() {
        const translations = {
            view1: "View 1",
            view2: "View 2",
            view3: "View 3"
        }

        await crs.binding.translations.add(translations, "tab");
    }

    async disconnectedCallback() {
        await crs.binding.translations.delete("tab");
        await super.disconnectedCallback();
    }
}