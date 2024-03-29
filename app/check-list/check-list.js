import "./../../components/check-list/check-list.js";
import "./../../components/checkbox/checkbox.js";

export default class CheckList extends crsbinding.classes.ViewBase {
    async preLoad() {
        const translations = {
            item1: "Item 1",
            item2: "Item 2",
            item3: "Item 3",
            item4: "Item 4"
        }

        await crsbinding.translations.add(translations, "checklist");
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        const checklists = document.querySelectorAll("check-list");
        for (const checklist of checklists) {
            if (checklist.__selectionManager != null) {
                await crs.call("selection", "disable", {element: checklist});
            }
        }

        await crsbinding.translations.delete("checklist");
        await super.disconnectedCallback();
    }

    async getAll() {
        const dataValues = await crs.call("dom_collection", "get_selected_state", {target:  document.querySelector("check-list")});
        console.log(dataValues)
    }
}