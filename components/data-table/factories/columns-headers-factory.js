import {DataTableExtensions} from "../data-table-extensions.js";

/**
 * @function columnsHeadersFactory - create column header cells from the columns definitions.
 * The columns definitions are the columns on the columns manager and contains the following properties:
 * - title: the title of the column
 * - width: the width of the column
 * - property: the property name of the column
 * @param columns
 * @returns {Promise<HTMLElement>}
 */
export async function columnsHeadersFactory(columns, table) {
    let header = document.createElement("div");
    header.role = "row";
    header.classList.add("header");

    for (const column of columns) {
        let th = document.createElement("div");
        th.role = "columnheader";
        th.dataset.field = column.property;
        th.dataset.type = column.dataType;
        th.textContent = column.title;
        header.appendChild(th);
    }

    await table.callExtension(DataTableExtensions.FILTER.name, "initialize", header);
    await table.callExtension(DataTableExtensions.RESIZE.name, "initialize", header);

    return header;
}