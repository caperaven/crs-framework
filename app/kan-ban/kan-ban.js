export default class KanBan extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("grid_columns", "add_columns", {
            element: this.kanban,
            columns: {
                id: 1001,
                width: 200
            }
        })

        await crs.call("kanban", "add_card", {
            element: this.kanban,
            cards: [],
            column: 1001
        })
    }
}