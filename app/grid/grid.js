import "../../src/actions/columns-actions.js";

export default class Grid extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async addColumn() {
        await crs.call("grid_columns", "add_columns", {
            element: this.grid,
            columns: [{ id: 1001, width: 200, title: `Column ${this.grid.columns.length}` }]
        })
    }
}