import {Sizes} from "./sizes.js";

/**
 * This class manages the grid layout data for rendering.
 * It does not do the rendering directly but provides the data to the renderer.
 * If for example you want to render a grid using canvas, you can use this class to get the data and then render it using canvas.
 * It provides features that allow you to find the position of a cell, the size of a cell, the size of the grid, etc.
 * When interacting on the canvas, for example clicking on a cell, you can use this class to find the cell that was clicked.
 *
 * When rendering a column, you need to know.
 * 1. aabb (top left and bottom right corners)
 * 2. field name
 * 3. row index
 *
 * The data manager is queried for the row and the value is extract from the row's column.
 * Then the value is rendered at the specified position.
 * Same goes for cell editing and other operations like toggling cell boolean data
 */
export class GridData {
    #rowSizes;
    #colSizes;
    #groups = {};

    get rowCount() {
        return this.#rowSizes.length;
    }

    get rowSizes() {
        return Object.freeze(this.#rowSizes);
    }

    get colCount() {
        return this.#colSizes.length;
    }

    get colSizes() {
        return Object.freeze(this.#colSizes);
    }

    get groups() {
        return Object.freeze(this.#groups);
    }

    constructor(rowCount, rowSize, colCount, colSize) {
        this.#rowSizes = new Sizes(rowCount, rowSize);
        this.#colSizes = new Sizes(colCount, colSize);
    }

    dispose() {
        this.#rowSizes = null;
        this.#colSizes = null;
        this.#groups = null;
    }

    /**
     * Set the column groups.
     * The group data is a dictionary where the key is the group name and the value is the group data.
     * The group data is an object with the following properties:
     * - start: The start index of the group.
     * - end: The end index of the group. If not provided, it will be set to the last column index.
     * @param groups
     */
    setColumnGroups(groups) {
        validateGroups(groups, this.colCount);
        this.#groups = groups;
    }

    /**
     * Resize rows in the table using a dictionary.
     * The key of the dictionary is the row index and the value is the new size of the row.
     *
     * Example:
     * {
     *     0: 200,  // set row 0 to 200px
     *     10: 50   // set row 10 to 50px
     * }
     * @param rowSizes {Object} - A dictionary where the key is the row index and the value is the new size of the row.
     */
    setRowHeights(rowSizes) {
        this.#rowSizes.setSizes(rowSizes);
    }

    /**
     * Resize columns in the table using a dictionary.
     * The key of the dictionary is the column index and the value is the new size of the column.
     * Example:
     * {
     *    0: 200,  // set column 0 to 200px
     *    10: 50   // set column 10 to 50px
     *    ...
     * }
     * @param colSizes {Object} - A dictionary where the key is the column index and the value is the new size of the column.
     */
    setColumnWidths(colSizes) {
        this.#colSizes.setSizes(colSizes);
    }

    /**
     * When doing scrolling, you need to know the total size of the grid.
     * This method returns the total size of the grid in the x and y directions.
     * You can place a 1 pixel marker at this position to indicate the scroll position
     * @returns {{x: Number, y: Number}}
     */
    getScrollMarkerVector() {
        return {x: this.#colSizes.totalSize, y: this.#rowSizes.totalSize};
    }

    getPageDetails(scrollX, scrollY, width, height) {
        const columns = this.#colSizes.getVisibleRange(scrollX, width);
        const rows = this.#rowSizes.getVisibleRange(scrollY, height);

        const columnsCumulative = [];
        const rowsCumulative = [];

        for (let i = columns.start; i <= columns.end; i++) {
            columnsCumulative.push(this.#colSizes.cumulative(i));
        }

        for (let i = rows.start; i <= rows.end; i++) {
            rowsCumulative.push(this.#rowSizes.cumulative(i));
        }

        return {
            visibleColumns: columns,
            columnsCumulative: columnsCumulative,
            visibleRows: rows,
            rowsCumulative: rowsCumulative,
            groups: this.#groups
        };
    }

    getCellAtPoint(x, y, scrollX, scrollY) {
    }
}

function validateGroups(groupData, columnCount) {
    const keys = Object.keys(groupData);
    for (const key of keys) {
        const start = groupData[key].start;
        const end = groupData[key].end ?? columnCount - 1;

        if (start < 0 || start > columnCount - 1) {
            throw new Error(`Invalid start index for group ${key}: ${start}`);
        }

        if (end < 0 || end > columnCount - 1) {
            throw new Error(`Invalid end index for group ${key}: ${end}`);
        }
    }
}