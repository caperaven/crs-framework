export const Alignment = Object.freeze({
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right'
})

export const SortDirection = Object.freeze({
    NONE: 'none',
    ASC: 'asc',
    DESC: 'desc'
})

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

const DEFAULT_WIDTH = 100;
const DEFAULT_ALIGN = Alignment.LEFT;
const DEFAULT_SORTABLE = true;
const DEFAULT_SORT_DIRECTION = SortDirection.NONE;

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
     * @returns {{sortDirection: string, isReadOnly: boolean, field, dataType: string, width: number, sortable: boolean, title, align: string}}
     */
    static create(title, field, dataType=DataType.STRING, isReadOnly=true, width=DEFAULT_WIDTH, align=DEFAULT_ALIGN, sortable=DEFAULT_SORTABLE, sortDirection=DEFAULT_SORT_DIRECTION) {
        return {
            title: title,
            field: field,
            dataType: dataType,
            isReadOnly: true,
            width: width,
            align: align,
            sortable: sortable,
            sortDirection: sortDirection
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
     * Get an immutable copy of the collection.
     * We return it as read only to prevent the caller from modifying the collection.
     * @returns {Readonly<*[]>}
     */
    get() {
        return Object.freeze(this.#collection)
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
    toCSS() {
        let stack = [];

        let currentItem = {
            width: 0,
            count: 0
        }

        for (let column of this.#collection) {
            if (column.width === currentItem.width) {
                currentItem.count++;

                // if this is the last item, push it to stack
                if (this.#collection.indexOf(column) === this.#collection.length - 1) {
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
}