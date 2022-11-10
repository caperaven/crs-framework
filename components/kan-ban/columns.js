export function addColumnFeatures(instance) {
    instance.addColumnElements = addColumnElements;
    instance.removeColumnElements = removeColumnElements;
}

/**
 * Create the required elements in the header and container for the new columns
 * @param columns
 * @returns {Promise<void>}
 */
async function addColumnElements(columns) {
    let index = 0;
    for (const column of columns) {
        const header = await crs.call("dom", "create_element", {
            tag_name: "crs-widget",
            text_content: column.title,
            id: column.id,
            attributes: {
                "data-name": column.title,
                role: "columnheader"
            }
        })

        this.header.appendChild(header);

        const cell = await crs.call("dom", "create_element", {
            id: index,
            attributes: {
                role: "cell"
            },
            dataset: {
                index: index
            }
        })

        column.container = cell;

        this.container.appendChild(cell);
        index += 1;
    }

    dispatchEvent(new CustomEvent("columns-added", {detail: this}));
}

/**
 * Remove columns
 * @param index
 * @param count
 * @returns {Promise<void>}
 */
async function removeColumnElements(index, count) {
    dispatchEvent(new CustomEvent("columns-removed", {detail: this}));
}

/**
 * Move the column elements from location to location
 * @param from
 * @param to
 * @returns {Promise<void>}
 */
async function moveColumnElement(from, to) {
    dispatchEvent(new CustomEvent("columns-moved", {detail: this}));
}
