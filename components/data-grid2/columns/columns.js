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

const DEFAULT_WIDTH = 100;
const DEFAULT_ALIGN = Alignment.LEFT;
const DEFAULT_SORTABLE = true;
const DEFAULT_SORT_DIRECTION = SortDirection.NONE;

class Column {
    static create(title, width=DEFAULT_WIDTH, align=DEFAULT_ALIGN, sortable=DEFAULT_SORTABLE, sortDirection=DEFAULT_SORT_DIRECTION) {
        return {
            title: title,
            width: width,
            align: align,
            sortable: sortable,
            sortDirection: sortDirection
        }
    }
}

export class Columns {
    #collection = [];

    dispose() {
        this.#collection = null;
    }

    get() {
        return Object.freeze(this.#collection)
    }

    /**
     * Add column to collection
     * @param title - column title - default is empty string
     * @param width - column width in pixels - default is 100px
     * @param align - column text alignment - default is left
     * @param sortable - is column sortable - default is true
     * @param sortDirection - column sort direction - default is none
     */
    add(title, width=DEFAULT_WIDTH, align=DEFAULT_ALIGN, sortable=DEFAULT_SORTABLE, sortDirection=DEFAULT_SORT_DIRECTION) {
        this.#collection.push(Column.create(title, width, align, sortable, sortDirection));
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