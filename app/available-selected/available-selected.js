import "./../../components/available-selected/available-selected-actions.js";

export default class AvailableSelected extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async preLoad() {}

    async connectedCallback() {
        await super.connectedCallback();

        const data = [
            {
                title: "Item 1",
                selected: true
            },
            {
                title: "Item 2",
                selected: true
            },
            {
                title: "Item 5",
                selected: true
            },
            {
                title: "Item 6",
                selected: true
            },
            {
                title: "Item 3"
            },
            {
                title: "Item 4"
            }
        ]

        const availableSelecteds = document.querySelectorAll("available-selected");
        for (const item of availableSelecteds) {
            await crs.call("available_selected", "set_records", {element: item, items: JSON.parse(JSON.stringify(data))});
        }
    }
}