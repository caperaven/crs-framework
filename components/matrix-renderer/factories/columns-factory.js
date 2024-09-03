import {ColumnBuilder} from "../builders/column-builder.js";

export class ColumnsFactory {
    static from(definition) {
        const result = [];
        for (const column of definition) {
            result.push(ColumnBuilder.from(column).build());
        }
        return result;
    }
}