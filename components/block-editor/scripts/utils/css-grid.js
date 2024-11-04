// deno-lint-ignore-file require-await
export class CssGridModule {
    static name = Object.freeze("css_grid");

    /**
     * @method from
     * @description - Convert CSS grid-template-columns and grid-template-rows to an object
     * @param args
     * @param {string} args.columns - The grid-template-columns value
     * @param {string} args.rows - The grid-template-rows value
     * @returns {Promise<void>}
     */
    static async from(args) {
        return {
            columns: args.columns.split(" "),
            rows: args.rows.split(" "),
        };
    }

    /**
     * @method to
     * @description - Convert an object to CSS grid-template-columns and grid-template-rows
     * @param args
     * @param {object} args.data - The object to convert
     * @param {string[]} args.data.columns - The columns of the grid
     * @param {string[]} args.data.rows - The rows of the grid
     * @returns {Promise<{columns: string, rows: string}>}
     */
    static async to(args) {
        return {
            columns: args.data.columns.join(" "),
            rows: args.data.rows.join(" "),
        };
    }

    /**
     * @method apply
     * @description - Apply the grid data to a CSS grid element
     * This includes the css properties for grid-template-columns and grid-template-rows
     * but also updates the child count.
     * If the new cell count is greater than the current child count, more children are added.
     * If the new cell count is less than the current child count, children are removed.
     * Each cell will also have a data-cell attribute set to the cell code.
     * @param args
     * @param {object} args.data - The grid data to apply created using the create method
     * @returns {Promise<void>}
     */
    static async apply(args) {
        const {data, element} = args;
        const css = await CssGridModule.to({ data });

        //JHR: use css optimized values

        element.style.display = "grid";
        element.style.gridTemplateColumns = css.columns;
        element.style.gridTemplateRows = css.rows;
        element.style.width = "100%";
        element.style.height = "100%";

        await syncGridChildren(element, data);
    }

    /**
     * @method create
     * @description - Create a Object for columns and rows based on the columnCount and rowCount
     * All columns and rows are set to 1fr by default
     * @param args
     * @param {number} args.columnCount - The number of columns to create
     * @param {number} args.rowCount - The number of rows to create
     * @returns {Promise<{columns: any[], rows: any[]}>}
     */
    static async create(args) {
        args = args ?? {};

        const columns = new Array(args.columnCount).fill("1fr");
        const rows = new Array(args.rowCount).fill("1fr");

        return {
            columns,
            rows,
        };
    }

    /**
     * @method push
     * @description - Add a column or row to the grid data
     * @param args
     * @param {object} args.data - The grid data to update
     * @param {string} args.column - The column to add
     * @param {string} args.row - The row to add
     * @returns {Promise<*>}
     */
    static async push(args) {
        if (args.column) {
            args.data.columns.push(args.column);
        }

        if (args.row) {
            args.data.rows.push(args.row);
        }

        return args.data;
    }

    /**
     * @method optimize
     * @description - Optimize the grid data by removing any duplicate columns or rows
     * For example "1fr 1fr 1fr" becomes "repeat(3, 1fr)"
     * and "1fr 1fr 2fr 3fr" becomes "repeat(2, 1fr) 2fr 3fr"
     * @param args
     * @param {string} args.values - The grid values to optimize
     * @returns {Promise<string>}
     */
    static async optimize(args) {
        const parts = args.values.split(" ");
        const optimized = [];
        let count = 1;
        let current = parts[0];

        for (let i = 1; i < parts.length; i++) {
            if (parts[i] === current) {
                count++;
            } else {
                if (count > 1) {
                    optimized.push(`repeat(${count}, ${current})`);
                } else {
                    optimized.push(current);
                }
                current = parts[i];
                count = 1;
            }
        }

        if (count > 1) {
            optimized.push(`repeat(${count}, ${current})`);
        } else {
            optimized.push(current);
        }

        return optimized.join(" ");
    }

    /**
     * @method toRegions
     * @description - Convert grid data to a 2D array of regions based on the columns and rows
     * The regions are named using letters starting from A
     * @param args
     * @param {object} args.data - The grid data to convert
     * @param {string[]} args.data.columns - The columns of the grid
     * @param {string[]} args.data.rows - The rows of the grid
     * @returns {Promise<any[]>}
     *
     * @extends: calling
     * CssGridModule.toRegions({ data: { columns: ["1fr", "1fr", "1fr"], rows: ["1fr", "1fr", "1fr"] })
     *
     * @example: Result
     * [A0][B0][C0]
     * [A1][B1][C1]
     * [A2][B2][C2]
     */
    static async to_regions(args) {
        const result = [];

        for (let i = 0; i < args.data.rows.length; i++) {
            const row = [];
            for (let j = 0; j < args.data.columns.length; j++) {
                row.push(String.fromCharCode(65 + j) + (i));
            }
            result.push(row);
        }

        return result;
    }

    /**
     * @method copyRegion
     * @description - Copy a region from the defined column and row to fill an area defined by the second point.
     * The region is copied from the start column and row to the end column and row.
     * @param args
     * @param {object} args.regions - The regions grid that was created using the to_regions method
     * @param {string} args.start - The starting point for the region to copy
     * @param {string} args.end - The ending point for the region to copy
     *
     * @example: Calling
     * CssGridModule.copyRegion({
     * 	regions: [	["A0", "B0", "C0"], ["A1", "B1", "C1"], ["A2", "B2", "C2"] ],
     * 	start: {row: 0, column: 0},
     * 	end: {row: 1, column: 1}
     *
     * 	returns [
     * 		["A0", "A0", "C0"],
     * 		["A0", "A0", "C1"],
     * 		["A2", "B2", "C2"]
     * 	]
     * 	@return {Promise<*>}
     */
    static async copy_region(args) {
        const {regions, start, end} = args;

        // Validate start and end points
        if (start.row < 0 || start.row >= regions.length || start.column < 0 || start.column >= regions[0].length) {
            throw new Error("CssGridModule.copyRegion: Start point is out of bounds");
        }
        if (end.row < 0 || end.row >= regions.length || end.column < 0 || end.column >= regions[0].length) {
            throw new Error("CssGridModule.copyRegion: End point is out of bounds");
        }

        const copyValue = args.regions[start.row][start.column];
        for (let i = start.row; i <= end.row; i++) {
            for (let j = start.column; j <= end.column; j++) {
                regions[i][j] = copyValue;
            }
        }

        return regions;
    }

    /**
     * @method resetRegion
     * @description - Reset a region to the default value and reshape the regions so that it is square.
     * For example if I have the following regions:
     * [A0][A0][C0]
     * [A0][A0][C1]
     * [A2][B2][C2]
     * and I reset row 1 column 1, the result would be:
     * [A0][B0][C0]
     * [A0][B1][C0]
     * [A2][B2][C2]
     * if I reset row 0 column 1, the result would also be the same.
     * In other words the region result must be square.
     *
     * @param args
     * @param {object} args.regions - The regions grid that was created using the to_regions method
     * @param {string} args.row - The row to reset
     * @param {string} args.column - The column to reset
     * @return {Promise<*>}
     */
    static async reset_region(args) {
        const {regions, row, column} = args;

        const cellCode = regions[row][column];
        const originalLocation = decode(cellCode);

        resetAdjacentRegions(regions, originalLocation.row, originalLocation.column, row, column, cellCode);
        return regions;
    }
}

function resetAdjacentRegions(regions, sourceRow, sourceColumn, row, column, cellCode) {
    // if the reset point is the origin and the value is the origin, return the regions
    // basically do nothing
    if (sourceRow === row && sourceColumn === column) {
        return regions;
    }

    if (sourceColumn === column) {
        return regions;
    }

    regions[row][column] = `${String.fromCharCode(65 + column)}${row}`;

    /**
     * [x][x][0][0]
     * [x][-][0][0]
     * [0][0][0][0]
     * */

    const maxColumn = regions[0].length - 1;
    const maxRows = regions.length - 1;

    const investigateCells = [];

    // add above cell
    addCell(regions, Math.max(row - 1, 0), column, cellCode, investigateCells);

    // add above right cell
    addCell(regions, Math.max(row - 1, 0), Math.max(column + 1, maxColumn), cellCode, investigateCells);

    // add right cell
    addCell(regions, row, Math.max(column + 1, maxColumn), cellCode, investigateCells);

    // add below right cell
    addCell(regions, Math.min(row + 1, maxRows), Math.max(column + 1, maxColumn), cellCode, investigateCells);

    // add below cell
    addCell(regions, Math.min(row + 1, maxRows), column, cellCode, investigateCells);

    // update value on cells to change
    // this happens recursively until all cells are updated that need to be updated
    for (const point of investigateCells) {
        resetAdjacentRegions(regions, sourceRow, sourceColumn, point.row, point.column, cellCode);
    }
}

function addCell(regions, row, column, cellCode, investigateCells) {
    if (regions[row][column] === cellCode) {
        investigateCells.push({ row, column });
    }
}

function letterToNumber(letter) {
    return letter.toUpperCase().charCodeAt(0) - 65; // 65 is the ASCII code for 'A'
}

/**
 * @function decode
 * @description - Decode a cell code to a row and column number
 * For example: "A0" would be row 0 and column 0 and "B1" would be row 1 and column 1
 * @param cellCode
 */
function decode(cellCode) {
    const column = letterToNumber(cellCode[0]);
    const row = parseInt(cellCode.substring(1));
    return { row, column };
}

/**
 * @function syncGridChildren
 * @description - Sync the children of a grid element with the grid data
 * Find out what the last child code is and figure out if we need to add or remove children
 * @param element
 * @param data
 */
async function syncGridChildren(element, data) {
    if (element.children.length === 0) {
        return await fillGrid(element, data);
    }

    const lastCode = element.lastElementChild.dataset.code;
}

/**
 * @function fillGrid
 * @description - Fill a grid element with cells based on the grid data
 * @param element {HTMLElement} - The grid element to fill
 * @param data {object} - The grid data to use
 */
async function fillGrid(element, data) {
    const div = document.createElement("div");
    div.dataset.droptarget = "true";
    div.style.width = "100%";
    div.style.height = "100%";

    for (let i = 0; i < data.rows.length; i++) {
        for (let j = 0; j < data.columns.length; j++) {
            const cell = div.cloneNode();
            cell.dataset.code = `${String.fromCharCode(65 + j)}${i}`;
            cell.style.gridArea = cell.dataset.code;
            element.appendChild(cell);
        }
    }

    const areas = await CssGridModule.to_regions({ data });
    element.style.gridTemplateAreas = areasToString(areas);
}

function areasToString(areas) {
    return areas.map(row => `"${row.join(" ")}"`).join(" ");
}