export class ColumnsActions {
    static #columnsProperty = "--columns";

    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Add a collection of columns to the grid
     * @param element
     * @param columns
     *
     * a column = {
     *     title: "column title",
     *     width: 100
     *     align: <optional> "left", "right", "middle",
     *     group: <optional> index of group
     * }
     */
    static async add_columns(step, context, process, item) {
        const grid = await crs.dom.get_element(step, context, process, item);
        const columns = await crs.process.getValue(step.args.columns, context, process, item);
        addToCollection(grid.columns, columns);
        writeCSSColumns(grid, this.#columnsProperty, grid.columns);
    }

    /**
     * Remove a column from a certain index
     * @param element
     * @param index
     * @param count: <optional>
     */
    static async remove_columns(step, context, process, item) {
        const grid = await crs.dom.get_element(step, context, process, item);
        const index = await crs.process.getValue(step.args.index, context, process, item);
        const count = (await crs.process.getValue(step.args.count, context, process, item)) || 1;

        grid.columns.splice(index, count);
        writeCSSColumns(grid, this.#columnsProperty, grid.columns);
    }

    /**
     * Move a column from the "from" index to the "too" index
     * @param element
     * @param from
     * @param too
     * @returns {Promise<void>}
     */
    static async move_columns(step, context, process, item) {

    }

    /**
     * Add a collection of groups to the grid
     * @param element
     * @param groups
     *
     * a group = {
     *      title: "group title",
     *      index: column index to start
     *      span: how many columns does it span
     * }
     */
    static async add_groups(step, context, process, item) {
        const grid = await crs.dom.get_element(step, context, process, item);
        const groups = await crs.process.getValue(step.args.groups, context, process, item);
        addToCollection(grid.columnGroups, groups);
    }

    /**
     * Remove a column group from a certain index
     * @param element
     * @param index
     * @param count: <optional>
     */
    static async remove_group(step, context, process, item) {
        const grid = await crs.dom.get_element(step, context, process, item);
        const index = await crs.process.getValue(step.args.index, context, process, item);
        const count = (await crs.process.getValue(step.args.count, context, process, item)) || 1;

        grid.columnGroups.splice(index, count);
    }

    /**
     * Move a column group from the "from" index to the "too" index
     * @param element
     * @param from
     * @param too
     * @returns {Promise<void>}
     */
    static async move_group(step, context, process, item) {

    }

    /**
     * set the width of the css variable
     * @param element
     * @param index
     * @param width
     */
    static async set_width(step, context, process, item) {
        const grid = await crs.dom.get_element(step, context, process, item);
        const index = await crs.process.getValue(step.args.index, context, process, item);
        const width = await crs.process.getValue(step.args.width, context, process, item);
        grid.columns[index].width = width;
    }
}

function addToCollection(collection, items) {
    for (const item of items) {
        collection.push(item);
    }
}

function writeCSSColumns(element, property, value) {
    value = value.map(item => `${item.width}px`).join(" ");
    getComputedStyle(element).setProperty(property, value);
}

crs.intent.grid_columns = ColumnsActions;