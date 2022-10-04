export async function addColumnFeatures(instance) {
    instance.addColumnElements = addColumnElements;
    instance.removeColumnElements = removeColumnElements;
}

/**
 * Create the required elements in the header and container for the new columns
 * @param columns
 * @returns {Promise<void>}
 */
async function addColumnElements(columns) {
    for (const column of columns) {
        const header = await crs.call("dom", "create_element", {
            text_content: column.title,
            attributes: {
                role: "columnheader",
            },
            styles: column.styles,
            classes: column.classes
        })

        this.rowContainer.parentElement.insertBefore(header, this.rowContainer);
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
