export function getQuery(path) {
    const query = [];

    getLeafQuery(path, query);
    getShadowPath(path, query);

    return query.join(" ");
}

function getLeafQuery(path, query) {
    const target = path[0];

    if (target.id?.trim() > 0) {
        query.push(`#${target.id}`);
    }
    else if (target.dataset.id != null) {
        query.push(`[data-id="${target.dataset.id}"]`);
    }
    else if (target.getAttribute("aria-label") != null) {
        query.push(`[aria-label="${target.getAttribute("aria-label")}"]`);
    }
    else if (target.getAttribute("title") != null) {
        query.push(`[aria-labelledby="${target.getAttribute("title")}"]`);
    }
    else if (Object.keys(target.dataset).length > 0) {
        const keys = Object.keys(target.dataset);
        const values = Object.values(target.dataset);

        for (let i = 0; i < keys.length; i++) {
            query.push(`[data-${keys[i]}="${values[i]}"]`);
        }
    }
    else {
        query.push(target.tagName.toLowerCase());
    }
}

function getShadowPath(path, query) {
    for (let i = 0; i < path.length; i++) {
        const target = path[i];

        if (target.shadowRoot != null) {
            // add element tag name to as the first item in the query
            query.unshift(target.tagName.toLowerCase());
        }
    }
}