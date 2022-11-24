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

    async disconnectedCallback() {
        await crsbinding.translations.delete("checklist");
        await super.disconnectedCallback();
    }

    async getAll() {
        const result = Array.from(this.checklist.querySelectorAll("[aria-selected='true']"));
        const dataValues = result.map(item => item.dataset.value);
        console.log(dataValues);
    }
}