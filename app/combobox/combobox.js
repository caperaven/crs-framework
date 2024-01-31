import "./../../components/combo-box/combo-box.js";

export default class ComboboxViewModel extends crs.classes.BindableElement {
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
        await this.setProperty("selected1", "test_2");
    }

    async populate() {
        const data = [
            { value: "item1", text: "Item 1" },
            { value: "item2", text: "Item 2" },
            { value: "item3", text: "Item 3" },
            { value: "item11", text: "Item 11" }
        ]

        await this.setProperty("model.products.data", data);
    }
}