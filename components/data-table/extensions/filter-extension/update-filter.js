export async function updateFilter(perspective, field, dataManager) {
    const counts = await crs.call("data_manager", "get_counts", {
        manager: dataManager
    })

    // nothing was selected, and you can't have a filter with nothing so do nothing
    if (counts.selected === 0) return;

    if (counts.total == counts.selected) {
        return await crs.call("perspective", "remove_filter", { perspective, field });
    }

    let operator = "eq";

    const half = counts.total / 2;
    const offset = counts.total - counts.selected;
    const useSelected = offset >= half || counts.selected === 1;

    const values = await getValues(dataManager, useSelected);

    if (values.length > 1) {
        operator = useSelected ? "one_of" : "not_one_of";
    }

    const value = values.length === 1 ? values[0] : values;

    await crs.call("perspective", "add_filter", { perspective, field, operator, value });
}

async function getValues(dataManager, selected = true) {
    const action = selected ? "get_selected" : "get_unselected";

    const valuesDef = await crs.call("data_manager", action, {
        manager: dataManager
    })

    return valuesDef.map(item => item.value);
}