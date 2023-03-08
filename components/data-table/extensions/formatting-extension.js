import {DataTableExtensions} from "./../data-table-extensions.js";

export default class FormattingExtension {
    #settings;
    #table;

    constructor(table, settings) {
        this.#settings = settings;
        this.#table = table;
    }

    dispose() {
        this.#settings = null;
        this.#table = null;
        return DataTableExtensions.FORMATTING.path;
    }

    #createRowCode() {

    }

    #createCellCode() {

    }

    /**
     * @method createFormattingCode - create the code to apply the formatting to the data table.
     * @param code {Array} - The code to add the formatting code to.
     * @returns {Promise<void>}
     */
    createFormattingCode(code) {

    }
}