/**
 * @class ColumnsManager
 * This class provides features for managing columns.
 * It provides the default interface that you interact with when using the data-table component.
 * It only manages the data and the relevant providers will update the DOM.
 *
 * Features:
 * - Add columns
 * - Remove columns
 * - Move columns
 * - Set the size of a column
 *
 * @property widths {Array} - array of column widths
 * @property columns {Array} - array of columns objects
 *
 * Column structure:
 * - title {String} - column title, can be a translation key, will be translated on adding to manager
 * - width {Number} - column width in pixels
 */
export class ColumnsManager {
    #widths = [];
    #columns = [];

    /**
     * @property widths - array of column widths
     * @returns {*[]}
     */
    get widths() {
        return this.#widths;
    }

    /**
     * @property columns - array of columns objects
     * @returns {*[]}
     */
    get columns() {
        return this.#columns;
    }

    /**
     * @method dispose - free memory
     */
    dispose() {
        this.#widths.length = 0;
    }

    /**
     * @method append - add a column to the manager at the end of the list
     * @param title {string} - column title, can be a translation key, will be translated on adding to manager
     * @param width {number} - column width in pixels
     * @returns {Promise<void>}
     */
    async append(title, width) {
        if (title.indexOf("&{") !== -1) {
            title = await crsbinding.translations.get_with_markup(title);
        }

        this.#widths.push(width);
        this.#columns.push({title, width});
    }

    /**
     * @method insert - insert a column to the manager at the specified index
     * @param index {number} - index to insert the column
     * @param title {string} - column title, can be a translation key, will be translated on adding to manager
     * @param width {number} - column width in pixels
     * @returns {Promise<void>}
     */
    async insert(index, title, width) {
        if (!validIndex(this.#widths, index)) {
            return this.append(title, width);
        }

        if (title.indexOf("&{") !== -1) {
            title = await crsbinding.translations.get_with_markup(title);
        }

        this.#widths.splice(index, 0, width);
        this.#columns.splice(index, 0, {title, width});
    }

    /**
     * @method remove - remove a column from the manager at the specified index
     * @param index {number} - index to remove the column
     * @returns {Promise<void>}
     */
    async remove(index) {
        if (!validIndex(this.#widths, index)) return;

        this.#widths.splice(index, 1);
        this.#columns.splice(index, 1);
    }

    /**
     * @method move - move a column from one index to another
     * @param from {number} - index to move the column from
     * @param to {number} - index to move the column to
     * @returns {Promise<void>}
     */
    async move(from, to) {
        if (!validIndex(this.#widths, from) || !validIndex(this.#widths, to)) return;

        const width = this.#widths[from];
        const column = this.#columns[from];

        this.#widths.splice(from, 1);
        this.#columns.splice(from, 1);

        this.#widths.splice(to, 0, width);
        this.#columns.splice(to, 0, column);
    }

    /**
     * @method resize - set the width of a column
     * @param index {number} - index of the column to resize
     * @param width {number} - new width of the column
     * @returns {Promise<void>}
     */
    async resize(index, width) {
        if (!validIndex(this.#widths, index)) return;

        this.#widths[index] = width;
        this.#columns[index].width = width;
    }
}

function validIndex(collection, index) {
    return index >= 0 && index < collection.length;
}