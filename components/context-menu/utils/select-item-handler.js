export async function handleSelection(li, options, component) {
    if (li.matches(".parent-menu-item")) {
        await expandAndCollapseSubmenu(li);
        return;
    }

    //if the element does not have an id I want to do the comparison against its title
    const option = await findInStructure(options, li.id );

    if (option?.type != null) {
        // if a step we don't wait for the result as the context menu should close immediately
        crs.call(option.type, option.action, option.args);
    }

    component.dataset.value = option.id;
    component.callback?.({detail: option});

    component.remove();
}

export async function setFocusState(li) {
    li.tabIndex = 0;
    li.focus();
}

async function findInStructure(collection, id) {
    for (const item of collection) {
        if (item.id === id || item.id === parseInt(id)) return item;

        if (item.children != null) {
            const childItem = await findInStructure(item.children, id);
            if (childItem != null) {
                return childItem;
            }
        }
    }
}

async function expandAndCollapseSubmenu(li) {
    if (li.getAttribute("aria-expanded") === "true") {
        return toggleExpansionState(li);
    }

    await collapseOpenedListItems(li);
    await toggleExpansionState(li);
}

async function collapseOpenedListItems(selectedLi) {
    const listItems = selectedLi.parentElement.querySelectorAll(".parent-menu-item[aria-expanded='true']");
    for (const li of listItems) {
        if (li === selectedLi) continue;

        await toggleExpansionState(li);
    }
}

export async function toggleExpansionState(li, filterHeader, isMobile,groupHeader) {
    const isExpanded = li.getAttribute("aria-expanded") === "true";
    li.setAttribute("aria-expanded", !isExpanded);

    // We set the atViewportEdge attribute to false so that we recalculate the position of the submenu
    // This is to ensure that the submenu is always visible if the parent was already at the edge.
    const ul = li.querySelector(".submenu");
    ul.dataset.onEdge = "false";
}



