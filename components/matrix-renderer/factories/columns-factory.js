import {ColumnBuilder} from "../builders/column-builder.js";

export class Columns {
    static from(definition) {
        const result = [];
        for (const column of definition) {
            result.push(ColumnBuilder.from(column).build());
        }
        return result;
    }
}