import "/src/actions/columns-actions.js";

export default class KanBan extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async addColumn() {
        await crs.call("grid_columns", "add_columns", {
            element: this.kanban,
            columns: [{ id: 1001, width: 200, title: `Column ${this.kanban.columns.length}` }]
        })
    }
}