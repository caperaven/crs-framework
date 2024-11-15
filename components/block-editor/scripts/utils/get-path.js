export function getParentPath(parentElement) {
    if (parentElement.dataset.path != null) {
        if (parentElement.dataset.path === "/") {
            return "";
        }

        return parentElement.dataset.path;
    }

    return getParentPath(parentElement.parentElement);
}