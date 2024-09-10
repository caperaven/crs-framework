import { Align } from "../enums/align.js";
import { DataType } from "../enums/data-type.js";

class ColumnBuilder {
    #data = {
        title: "",
        field: "",
        width: 100,
        type: DataType.TEXT,
        align: Align.LEFT,
        editable: false,
        background: null,
        foreground: null
    }

    static from(column) {
        const builder = new ColumnBuilder();

        if (column.title) {
            builder.setTitle(column.title);
        }

        if (column.field) {
            builder.setField(column.field);
        }

        if (column.width) {
            builder.setWidth(column.width);
        }

        if (column.type) {
            builder.setType(column.type);
        }

        if (column.align) {
            builder.setAlign(column.align);
        }

        if (column.editable) {
            builder.setEditable(column.editable);
        }

        if (column.background) {
            builder.setBackground(column.background);
        }

        if (column.foreground) {
            builder.setForeground(column.foreground);
        }

        return builder;

    }

    setTitle(value) {
        this.#data.title = value;
        return this;
    }

    setField(value) {
        this.#data.field = value;
        return this;
    }

    setWidth(value) {
        this.#data.width = value;
        return this;
    }

    setType(value) {
        this.#data.type = value;
        return this;
    }

    setAlign(value) {
        this.#data.align = value;
        return this;
    }

    setEditable(value) {
        this.#data.editable = value;
        return this;
    }

    setBackground(value) {
        this.#data.background = value;
        return this;
    }

    setForeground(value) {
        this.#data.foreground = value;
        return this;
    }

    build() {
        return this.#data;
    }
}

export { ColumnBuilder, Align, DataType };