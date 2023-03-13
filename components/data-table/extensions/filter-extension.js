import {DataTableExtensions} from "./../data-table-extensions.js";

/**
 * @class ResizeExtension - add resize elements to the column headers.
 * This will add the UI required to resize the columns using the addElements method.
 */
export default class FilterExtension {
    #settings;
    #table;
    #parent;

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
        if (this.#parent) {
            this.#parent = null;
        }

        if (removeUI === true) {
            const filterElements = this.#table.element.querySelectorAll(".filter");
            for (const filterElement of filterElements) {
                filterElement.remove();
            }
        }

        return DataTableExtensions.FILTER.path;
    }

    initialize(columnsRow) {
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
}