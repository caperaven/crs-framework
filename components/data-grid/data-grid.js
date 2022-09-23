export class DataGrid extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}

customElements.define("data-grid", DataGrid);