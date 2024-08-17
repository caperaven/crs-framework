export const DATA_GRID_CELLS_QUERY = "grid-cells";

export default class GridCells extends crs.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    onMessage(args) {
        this.shadowRoot.innerHTML = "";
        console.log("GridCells.onMessage", args);
    }
}

customElements.define(DATA_GRID_CELLS_QUERY, GridCells);