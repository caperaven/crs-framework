import "./../../components/available-selected/available-selected-actions.js";

export default class AvailableSelected extends crsbinding.classes.ViewBase {
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
                title: "Item 3"
            },
            {
                title: "Item 4"
            }
        ]

        const availableSelected = document.querySelector("available-selected");
        await crs.call("available_selected", "set_records", {element: availableSelected, items: data});
    }
}