import "./../../components/checklist/checklist.js";

export default class ChecklistBox extends crsbinding.classes.ViewBase {
    async preLoad() {
        const translations = {
            item1: "Item 1",
            item2: "Item 2",
            item3: "Item 3",
            item4: "Item 4"
        }

        await crsbinding.translations.add(translations);
    }

    async connectedCallback() {
        await super.connectedCallback();
    }
}