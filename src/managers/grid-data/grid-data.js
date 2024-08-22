/**
 * This class manages the grid layout data for rendering.
 * It does not do the rendering directly but provides the data to the renderer.
 * If for example you want to render a grid using canvas, you can use this class to get the data and then render it using canvas.
 * It provides features that allow you to find the position of a cell, the size of a cell, the size of the grid, etc.
 * When interacting on the canvas, for example clicking on a cell, you can use this class to find the cell that was clicked.
 */
export class GridData {
    #rowCount = 0;
    #rowSize = 0;
    #colCount = 0;
    #colSize = 0;

    #rowSizes = {};
    #colSizes = {};

    get rowCount() {
        return this.#rowCount;
    }

    get rowSizes() {
        return Object.freeze(this.#rowSizes);
    }

    get colCount() {
        return this.#colCount;
    }

    get colSizes() {
        return Object.freeze(this.#colSizes);
    }

    constructor(rowCount, rowSize, colCount, colSize) {
        this.#rowCount = rowCount;
        this.#rowSize = rowSize;
        this.#colCount = colCount;
        this.#colSize = colSize;

        for (let i = 0; i < rowCount; i++) {
            this.#rowSizes[i] = rowSize;
        }

        for (let i = 0; i < colCount; i++) {
            this.#colSizes[i] = colSize;
        }
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
        const keys = Object.keys(rowSizes);
        for (let i = 0; i < keys.length; i++) {
            const rowIndex = parseInt(keys[i]);

            if (rowIndex > this.#rowCount - 1) {
                throw new Error(`Invalid row index: ${rowIndex}`);
            }

            this.#rowSizes[rowIndex] = rowSizes[rowIndex];
        }
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
        const keys = Object.keys(colSizes);
        for (let i = 0; i < keys.length; i++) {
            const colIndex = parseInt(keys[i]);

            if (colIndex > this.#colCount - 1) {
                throw new Error(`Invalid column index: ${colIndex}`);
            }

            this.#colSizes[colIndex] = colSizes[colIndex];
        }
    }
}