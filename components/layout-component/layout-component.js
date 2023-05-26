export default class LayoutComponent extends crsbinding.classes.BindableElement {

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
        await this.load();
    }

    load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                // render grid
                await this.#renderGrid();
                resolve();
            });
        })
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

    async #renderGrid() {
        const columns = this.dataset.columns;
        const rows = this.dataset.rows;

        if (columns == null && rows == null) return;

        await crs.call("cssgrid", "set_columns",{
            element: this,
            columns: columns
        });

        await crs.call("cssgrid", "set_rows",{
            element: this,
            rows: rows
        });
    }
}
customElements.define("layout-component", LayoutComponent);