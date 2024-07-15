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
});