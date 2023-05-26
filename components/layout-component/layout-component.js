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
            });
        })
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

    async #renderGrid() {
        //set grid columns
        await crs.call("cssgrid", "set_columns",{
            element: this,
            columns: this.dataset.columns
        });

        //set grid rows
        await crs.call("cssgrid", "set_rows",{
            element: this,
            rows: this.dataset.rows
        });
    }
}
customElements.define("layout-component", LayoutComponent);