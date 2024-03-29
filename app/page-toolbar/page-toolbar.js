import "./../../components/page-toolbar/page-toolbar.js";
import "../../src/managers/data-manager/data-manager-actions.js";
import "./../../test/test-data.js";

export default class PageToolbarViewModel extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async preLoad() {
        await crsbinding.translations.add({
            rowsPerPage: "rows per page"
        }, "pageToolbar");

        const data = await crs.call("test_data", "get", {
            fields: {
                code: "string:auto",
                description: "string:10",
                price: "float:1:100",
                quantity: "int:1:100",
                isValid: "bool"
            },
            count: 100
        });

        await crs.call("data_manager", "register", {
            manager: "my_data",
            id_field: "id",
            type: "memory",
            records: data
        })
    }
}