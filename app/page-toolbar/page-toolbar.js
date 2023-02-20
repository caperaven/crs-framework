import "./../../components/page-toolbar/page-toolbar.js";
import "./../../src/data-manager/data-manager-actions.js";

export default class PageToolbarViewModel extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async preLoad() {
        await crsbinding.translations.add({
            rowsPerPage: "rows per page"
        }, "pageToolbar");

        await crs.call("data_manager", "register", {
            manager: "my_data",
            id_field: "id",
            type: "memory",
            records: [
                { id: 1, code: "code 1", description: "description 1" },
                { id: 2, code: "code 2", description: "description 2" },
                { id: 3, code: "code 3", description: "description 3" }
            ]
        })
    }
}