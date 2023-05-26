import "./../../src/actions/virtualization-actions.js";
import "./../../test/test-data.js";
import "../../src/managers/data-manager/data-manager-actions.js";
import "../../components/checkbox/checkbox.js";
import "../../src/actions/collection-selection-actions.js";

export default class Virtualization extends crs.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        const itemTemplate = document.querySelector("#item-template");

        const data = await crs.call("test_data", "get", {
            fields: {
                code: "string:auto",
                quantity: "int:1:100"
            },
            count: 5000
        });

        await crs.call("data_manager", "register", {
            manager: "my_data",
            id_field: "id",
            type: "memory",
            records: data
        })

        await crs.call("virtualization", "enable", {
            element: this.ul,
            manager: "my_data",
            itemSize: 32,
            template: itemTemplate,
            inflation: this.#inflationFn
        });

        await crs.call("collection_selection", "enable", {
            element: this.element,
            master_query: "#master-checkbox",
            selection_query: '[role="checkbox"]',
            virtualized_element: this.ul,
            manager: "my_data"
        });
    }

    async disconnectedCallback() {
        await crs.call("virtualization", "disable", {
            element: this.ul
        });

        await super.disconnectedCallback();
    }

    #inflationFn(element, data) {
        const checkbox = element.querySelector("check-box");
        checkbox.checked = data._selected || false;
        checkbox.dataset.index = data._index;
        element.querySelector("div").textContent = data.code;
    }

    debug() {
        this.ul.__virtualizationManager.debug();
    }
}