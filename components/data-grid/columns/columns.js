import {assertRequired} from "../../../src/utils/assertRequired.js";
import {DataType} from "./enums/data-type.js";
import {ConversionType} from "./enums/conversion-type.js";
import {Column} from "./column.js";
import {DEFAULT_ALIGN, DEFAULT_SORT_DIRECTION, DEFAULT_SORTABLE, DEFAULT_WIDTH} from "./defaults.js";

export const ColumnMoveLocation = Object.freeze({
    BEFORE: "before",
    AFTER: "after"
});

/**
 * This class stores the column information for the data grid
 */
export class Columns {
    #collection = {};

    dispose() {
        this.#collection = null;
    }

    move(fromIndex, toIndex, location) {
        // check if the indexes are the same and that the toIndex is greater than the fromIndex
        if (fromIndex === toIndex || toIndex < fromIndex) return;
        // check if the fromIndex is out of bounds
        if (fromIndex < 0 || fromIndex >= this.#collection.length - 1) return;
        // check if the toIndex is out of bounds
        if (toIndex >= this.#collection.length - 1) return;

        toIndex = location === MoveLocation.BEFORE ? toIndex -1 : toIndex;

        const column = this.#collection[fromIndex];

        // JHR: todo.
    }

    /**
     * @description Get an immutable copy of the collection.
     * We return it as read only to prevent the caller from modifying the collection.
     * @returns {Readonly<*[]>}
     */
    get() {
        return Object.freeze(this.#collection)
    }

    /**
     * @description Set the collection.
     * @param collection
     */
    set(collection) {
        const keys = Object.keys(collection);

        for (const key of keys) {
            const column = collection[key];

            if (column.title == null || column.field == null) {
                throw new Error("Column title and field are required");
            }

            column.title ||= assertRequired(column.title, "data-grid2.columns.set", "Column title is required", false, "string");
            column.field ||= assertRequired(column.field, "data-grid2.columns.set", "Column field is required", false, "string");
            column.dataType ||= DataType.STRING;
            column.isReadOnly = column.isReadOnly ?? true;
            column.width ||= DEFAULT_WIDTH;
            column.align ||= DEFAULT_ALIGN;
            column.sortable ||= DEFAULT_SORTABLE;
            column.sortDirection ||= DEFAULT_SORT_DIRECTION;
            column.groupId ||= 0;
            column.order ||= 0;
        }

        this.#collection = collection;
        return this;
    }

    /**
     * Add column to collection
     * @param title - column title - default is empty string
     * @param field - column field name - default is empty string
     * @param dataType - column data type - default is string
     * @param isReadOnly - is column read only - default is true
     * @param width - column width in pixels - default is 100px
     * @param align - column text alignment - default is left
     * @param sortable - is column sortable - default is true
     * @param sortDirection - column sort direction - default is none
     */
    add(title, field, dataType=DataType.STRING, isReadOnly=true, width=DEFAULT_WIDTH, align=DEFAULT_ALIGN, sortable=DEFAULT_SORTABLE, sortDirection=DEFAULT_SORT_DIRECTION) {
        // 1. get the current key count
        const count = Object.keys(this.#collection).length;
        this.#collection[count] = Column.create(title, field, dataType, isReadOnly, width, align, sortable, sortDirection, 0, count);
    }

    /**
     * Create css grid column template string
     * @returns {string}
     */
    to(type) {
        switch (type) {
            case ConversionType.CSS: {
                return toCSS(this.#collection);
            }
            case ConversionType.JSON: {
                return toJSON(this.#collection);
            }
            case ConversionType.HTML: {
                return toHTML(this.#collection);
            }
            default:
                throw new Error(`Invalid conversion type [Columns.to] - ${type}`);
        }
    }

    /**
     * @description Generate a new instance of Columns from a source
     * @param type - conversion type - JSON, HTML
     * @param source - source data to convert from - JSON object or parent HTML element to query
     * @returns {Columns|null}
     */
    static from(type, source) {
        const result = new Columns();

        switch (type) {
            case ConversionType.JSON: {
                return result.set(fromJSON(source));
            }
            case ConversionType.HTML: {
                return result.set(fromHTML(source));
            }
            default:
                return null;
        }
    }
}

/**
 * @description Convert a collection of columns to a CSS grid template string
 * @param collection
 * @returns {string}
 */
function toCSS(collection) {
    let stack = [];

    let currentItem = {
        width: 0,
        count: 0
    }

    const keys = Object.keys(collection);
    for (const key of keys) {
        const column = collection[key];

        if (column.width === currentItem.width) {
            currentItem.count++;

            // if this is the last item, push it to stack
            if (keys.indexOf(key) === keys.length - 1) {
                stack.push(`repeat(${currentItem.count}, ${currentItem.width}px)`);
            }
        }
        else {
            if (currentItem.count > 0) {
                stack.push(`repeat(${currentItem.count}, ${currentItem.width}px)`);
                currentItem.width = 0;
                currentItem.count = 0;
            }
            else {
                currentItem.width = column.width;
                currentItem.count = 1;
            }
        }
    }

    return stack.join(' ');
}

/**
 * @description Convert a collection of columns from JSON
 * @param collection
 * @returns {string}
 */
function toJSON(collection) {
    return JSON.stringify(collection);
}

/**
 * @description Convert a collection of columns from HTML.
 * @param json
 * @returns {any}
 */
function fromJSON(json) {
    if (typeof json === "string") {
        return JSON.parse(json);
    }

    return json;
}

/**
 * @description Convert a collection of columns from HTML.
 * This will generate the header structure used by the grid
 * @param collection
 * @returns {DocumentFragment}
 */
function toHTML(collection) {
    const fragment = document.createDocumentFragment();
    const keys = Object.keys(collection);

    if (keys.length > 0) {
        for (const key of keys) {
            const column = collection[key];
            const columnElement = Column.to(ConversionType.HTML, column);
            fragment.appendChild(columnElement);
        }
    }

    return fragment;
}

function fromHTML(parentElement) {
    const columnElements = parentElement.querySelectorAll('column');
    const columns = {};

    let order = -1;
    for (let columnElement of columnElements) {
        const column = Column.from(ConversionType.HTML, columnElement);
        column.order = order++;
        columns[order] = column;
    }

    return columns;
}