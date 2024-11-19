export function getParentPath(parentElement) {
    if (parentElement.dataset.path != null) {
        if (parentElement.dataset.path === "/") {
            return "";
        }

        return parentElement.dataset.path;
    }

    return getParentPath(parentElement.parentElement);
}

export function getPathParts(path) {
    const pathParts = path.split("/");
    const id = pathParts.pop();
    const parentPath = pathParts.join("/");

    return { id, parentPath }
}