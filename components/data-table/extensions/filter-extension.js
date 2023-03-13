import {DataTableExtensions} from "./../data-table-extensions.js";

/**
 * @class ResizeExtension - add resize elements to the column headers.
 * This will add the UI required to resize the columns using the addElements method.
 */
export default class FilterExtension {
    #settings;
    #table;
    #parent;
    #filterHandler = this.#filter.bind(this);

    #lookupTable = {

    }

    /**
     * @constructor
     * @param table {DataTable} - The data table to add the resize elements to.
     * @param settings {Object} - The settings for the resize extension.
     */
    constructor(table, settings) {
        this.#settings = settings;
        this.#table = table;
    }

    dispose(removeUI) {
        this.#table.removeClickHandler(".filter");

        if (this.#parent) {
            this.#parent = null;
        }

        if (removeUI === true) {
            const filterElements = this.#table.element.querySelectorAll(".filter");
            for (const filterElement of filterElements) {
                filterElement.remove();
            }
        }

        this.#filterHandler = null;
        this.#lookupTable = null;

        return DataTableExtensions.FILTER.path;
    }

    initialize(columnsRow) {
        this.#table.addClickHandler(".filter", this.#filterHandler.bind(this));

        for (const column of columnsRow.children) {
            if (column.children.length == 0) {
                const text = column.textContent;

                const textDiv = document.createElement("div");
                textDiv.textContent = text;
                column.textContent = "";
                textDiv.classList.add("flex");
                column.appendChild(textDiv);
            }

            const filterElement = document.createElement("div");
            filterElement.classList.add("filter");
            filterElement.textContent = "filter-outline";

            column.appendChild(filterElement);
        }
    }

    async #filter(event) {
        const columnCellElement = event.composedPath()[1];
        const field = columnCellElement.dataset.field;

        if (this.#lookupTable[field] != null) {
            // show lookup values for filter operation
            console.log(this.#lookupTable[field]);
            return;
        }

        const dataManager = this.#table.dataManager;

        const data = await crs.call("data_manager", "get_all", { manager: dataManager });
        const uniqueValues = await crs.call("data_processing", "unique_values", { source: data, fields: [field] });

        this.#lookupTable[field] = uniqueValues[field];
        console.log(this.#lookupTable[field]);
    }
}