import {assertRequired} from "../../../src/utils/assertRequired.js";
import {Alignment} from "./enums/alignment.js";
import {SortDirection} from "./enums/sort-direction.js";
import {DataType} from "./enums/data-type.js";
import {DEFAULT_WIDTH, DEFAULT_ALIGN, DEFAULT_SORTABLE, DEFAULT_SORT_DIRECTION} from "./defaults.js";

/**
 * @description This class represents a column in the data grid
 * This is a factory class to create a column object
 * We use the class name here as a namespace to group related functions together
 * and to give context when reading the code
 */
export class Column {
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