/**
 * @function columnsHeadersFactory - create column header cells from the columns definitions.
 * The columns definitions are the columns on the columns manager and contains the following properties:
 * - title: the title of the column
 * - width: the width of the column
 * - property: the property name of the column
 * @param columns
 * @returns {Promise<HTMLElement>}
 */
export async function columnsHeadersFactory(columns) {
    let header = document.createElement("div");
    header.role = "row";

    for (const column of columns) {
        let th = document.createElement("div");
        th.role = "columnheader";
        th.dataset.field = column.property;
        th.textContent = column.title;
        header.appendChild(th);
    }

    return header;
}