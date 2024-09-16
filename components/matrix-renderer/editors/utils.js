export function onKeyDown(event, updateDataManagerCallback, stopPropagation = true) {
    if (event.code === "Escape") {
        event.target.blur();
    }

    if (event.code === "Enter" || event.code === "NumpadEnter") {
        // call data manager
        updateDataManagerCallback();
        event.target.blur();
    }

    if (event.code === "Tab") {
        // don't stopPropagation
        updateDataManagerCallback();
        event.target.blur();
        return;
    }

    if (stopPropagation) {
        event.stopPropagation();
    }
}

export function onBlur(event) {
    this.remove();
    crsbinding.events.emitter.emit("matrix-editing-removed", {});
}

export function updateDataManager(value, oldValue, manager, rowIndex, fieldName) {
    if (value !== oldValue) {
        crs.call("data_manager", "update", {
            manager: manager,
            index: rowIndex,
            changes: {
                [fieldName]: value
            }
        })
    }

}