import {assertRequired} from "../../../src/utils/assertRequired.js";


/**
 * @description How is data aligned in a cell
 * @type {Readonly<{CENTER: string, LEFT: string, RIGHT: string}>}
 */
export const Alignment = Object.freeze({
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right'
})

/**
 * @description for a given cell, how should the data be sorted
 * @type {Readonly<{ASC: string, NONE: string, DESC: string}>}
 */
export const SortDirection = Object.freeze({
    NONE: 'none',
    ASC: 'asc',
    DESC: 'desc'
})

/**
 * @description data types that can be displayed in a cell
 * This will also affect cell editing
 * @type {Readonly<{DATE: string, NUMBER: string, IMAGE: string, STRING: string, LINK: string, GEOLOCATION: string, BOOLEAN: string, MEMO: string}>}
 */
export const DataType = Object.freeze({
    STRING: 'string',
    NUMBER: 'number',
    DATE: 'date',
    BOOLEAN: 'boolean',
    MEMO: 'memo',
    IMAGE: 'image',
    LINK: 'link',
    GEOLOCATION: 'geolocation'
})

/**
 * @description how to convert columns to and from.
 * In other words
 * - from HTML
 * - from JSON
 * - to CSS
 * - to HTML
 * There is a difference in the from HTML and to HTML.
 * From HTML will read the HTML as markup but that is not the header HTML.
 * The to HTML will return the header HTML used by the grid for rendering.
 * @type {Readonly<{CSS: string, JSON: string, HTML: string}>}
 */
export const ConversionType = Object.freeze({
    CSS: "css",
    JSON: "json",
    HTML: "html"
});

const DEFAULT_WIDTH = 100;
const DEFAULT_ALIGN = Alignment.LEFT;
const DEFAULT_SORTABLE = true;
const DEFAULT_SORT_DIRECTION = SortDirection.NONE;

/**
 * @description This class represents a column in the data grid
 * This is a factory class to create a column object
 * We use the class name here as a namespace to group related functions together
 * and to give context when reading the code
 */
class Column {
    /**
     * Factory method to create a column object
     * @param title {string} - column title
     * @param field {string} - column field name
     * @param dataType {DataType} - column data type - default is DataType.STRING
     * @param isReadOnly {boolean} - is column read only - default is true
     * @param width {number} - column width in pixels - default is 100px
     * @param align {Alignment} - column text alignment - default is left
     * @param sortable {boolean} - is column sortable - default is true
     * @param sortDirection {SortDirection} - column sort direction - default is none
     * @param groupId {string} - column group id - default is null
     * @returns {{sortDirection: string, isReadOnly: boolean, field, dataType: string, width: number, sortable: boolean, title, align: string, groupId: null}}
     */
    static create(title,
                  field,
                  dataType=DataType.STRING,
                  isReadOnly=true,
                  width=DEFAULT_WIDTH,
                  align=DEFAULT_ALIGN,
                  sortable=DEFAULT_SORTABLE,
                  sortDirection=DEFAULT_SORT_DIRECTION,
                  groupId=null) {

        return {
            title: assertRequired(title, "data-grid2.columns", "Column title is required"),
            field: assertRequired(field, "data-grid2.columns", "Column field is required"),
            dataType,
            isReadOnly,
            width,
            align,
            sortable,
            sortDirection,
            groupId
        }
    }
}

/**
 * This class stores the column information for the data grid
 */
export class Columns {
    #collection = [];

    dispose() {
        this.#collection = null;
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
        if (!Array.isArray(collection)) {
            throw new Error("Collection must be an array");
        }

        for (let column of collection) {
            if (column.title == null || column.field == null) {
                throw new Error("Column title and field are required");
            }

            column.title ||= 'undefined';
            column.field ||= 'undefined';
            column.dataType ||= DataType.STRING;
            column.isReadOnly = column.isReadOnly ?? true;
            column.width ||= DEFAULT_WIDTH;
            column.align ||= DEFAULT_ALIGN;
            column.sortable ||= DEFAULT_SORTABLE;
            column.sortDirection ||= DEFAULT_SORT_DIRECTION;
            column.groupId ||= null;
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
        this.#collection.push(Column.create(title, field, dataType, isReadOnly, width, align, sortable, sortDirection));
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
                return null;
        }
    }

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

    for (let column of collection) {
        if (column.width === currentItem.width) {
            currentItem.count++;

            // if this is the last item, push it to stack
            if (collection.indexOf(column) === collection.length - 1) {
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
    return JSON.parse(json);
}

/**
 * @description Convert a collection of columns from HTML.
 * This will generate the header structure used by the grid
 * @param collection
 * @returns {string}
 */
function toHTML(collection) {
    let stack = [];

    for (let column of collection) {
        stack.push(`<div>${column.title}</div>`);
    }

    return stack.join('');
}

function fromHTML(parentElement) {
    return collection;
}