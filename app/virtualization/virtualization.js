import "./../../src/actions/virtualization-actions.js";

export default class Virtualization extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        const itemTemplate = document.querySelector("#item-template");

        await crs.call("virtualization", "enable", {
            element: this.ul,
            itemCount: 100,
            itemSize: 32,
            template: itemTemplate,
            inflation: this.#inflationFn
        });
    }

    #inflationFn(element, data) {
        console.log("inflation");
    }

    debug() {
        this.ul.__virtualizationManager.debug();
    }
}