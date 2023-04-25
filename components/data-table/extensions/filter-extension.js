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

    #callbackHandler = this.#callback.bind(this);

    #dialog = null;

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
        this.#callbackHandler = null;
        this.#dialog = null;
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

    /**
     * @private - filter handler
     * @method #filter - when you click on the filter icon, this will show the filter options.
     * @param event
     * @returns {Promise<void>}
     */
    async #filter(event) {
        const columnCellElement = event.composedPath()[1];
        const field = columnCellElement.dataset.field;

        if (this.#lookupTable[field] != null) {
            // show lookup values for filter operation
            await this.#showFilterOptions(columnCellElement, this.#lookupTable[field]);
            return;
        }

        const dataManager = this.#table.dataManager;

        const data = await crs.call("data_manager", "get_all", { manager: dataManager });
        const uniqueValues = await crs.call("data_processing", "unique_values", { source: data, fields: [field] });

        this.#lookupTable[field] = uniqueValues[field];
        await this.#showFilterOptions(columnCellElement, uniqueValues[field]);
    }

    /**
     * @private
     * @method #showFilterOptions - show a dialog that will contain the filter options to update
     * @param relativeElement {HTMLElement} - the element to position the dialog relative to.
     * @param filterOptions {array} - the filter options to show.
     * @returns {Promise<void>}
     */
    async #showFilterOptions(relativeElement, filterOptions) {
        const headerUrl = import.meta.url.replace(".js", "/header.html");
        const bodyUrl = import.meta.url.replace(".js", "/body.html");
        const footerUrl = import.meta.url.replace(".js", "/footer.html");

        const headerTemplate = await crs.call("html", "template_from_file", { url: headerUrl });
        const bodyTemplate = await crs.call("html", "template_from_file", { url: bodyUrl });
        const footerTemplate = await crs.call("html", "template_from_file", { url: footerUrl });

        this.#dialog = await crs.call("dialog", "show", {
            target: relativeElement,
            position: "bottom",
            anchor: "left",
            allow_resize: false,
            allow_move: false,
            min_height: "400px",
            min_width: "250px",
            header: headerTemplate.content.cloneNode(true),
            main: bodyTemplate.content.cloneNode(true),
            footer: footerTemplate.content.cloneNode(true),
            callback: this.#callbackHandler
        });
    }

    async #callback(args) {
        if (args.action === "accept") {
            // todo ... get the relevant data to apply a filter.

            const isNotDone = await this.#dialog.close();

            if (isNotDone === false) {
                this.#dialog = null;
            }
            return;
        }
    }
}