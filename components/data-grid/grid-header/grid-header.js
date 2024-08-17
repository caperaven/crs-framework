import {Columns} from "../columns/columns.js";
import {ConversionType} from "../columns/enums/conversion-type.js";

export const DATA_GRID_HEADER_QUERY = "grid-header";

export default class GridHeader extends crs.classes.BindableElement {
    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async onMessage(args) {
        this.shadowRoot.innerHTML = "";

        if (args.columns) {
            await createColumns(args.columns);
        }
    }
}

async function createColumns(sourceColumns) {
    const columns = Columns.from(ConversionType.JSON, sourceColumns);
}

customElements.define(DATA_GRID_HEADER_QUERY, GridHeader);