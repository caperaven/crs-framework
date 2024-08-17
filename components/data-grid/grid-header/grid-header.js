export const DATA_GRID_HEADER_QUERY = "grid-header";

export default class GridHeader extends crs.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    onMessage(args) {
        this.shadowRoot.innerHTML = "";
        console.log("GridHeader.onMessage", args);
    }
}

customElements.define(DATA_GRID_HEADER_QUERY, GridHeader);