import AvailableSelectedViewModel from "../available-selected/available-selected.js";

export default class CheckListViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    get hasStyle() {
        return false;
    }

    async preLoad() {
        const translations = {
            item1: "Item 1",
            item2: "Item 2",
            item3: "Item 3",
            item4: "Item 4"
        }

        await crs.binding.translations.add(translations, "checklist");
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await crs.binding.translations.delete("checklist");
        await super.disconnectedCallback();
    }

    async getAll() {
        const dataValues = await crs.call("dom_collection", "get_selected_state", {target:  document.querySelector("check-list")});
        console.log(dataValues)
    }
}