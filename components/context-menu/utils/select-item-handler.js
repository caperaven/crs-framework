export async function handleSelection(li, options, component, filterHeader) {
    if (li.matches(".parent-menu-item")) {
        filterHeader.clear();
        await expandAndCollapseSubmenu(li);
        return;
    }

    //if the element does not have an id I want to do the comparison against its title
    const title = li.getAttribute("aria-label");
    const option = await findInStructure(options, li.id || title);

    if (option.type != null) {
        // if a step we don't wait for the result as the context menu should close immediately
        crs.call(option.type, option.action, option.args);
    }

    //what do you do ?
    component.dataset.value = option.id;

    component.dispatchEvent(new CustomEvent("change", {detail: option}));

    await crs.call("context_menu", "close");
}

export async function setTabIndex(element,siblingType = null) {
    let li = element[siblingType];

    // If the next or previous sibling is null,
    // We want to get the first or last element in the ul list respectively and set the focus on it.
    if (li == null) {
        const elementPosition = {
            nextElementSibling: "firstElementChild",
            previousElementSibling: "lastElementChild"
        }[siblingType];
        li = element.parentElement[elementPosition];
    }

    element.tabIndex = -1;
    await setFocusState(li);
}

export async function setFocusState(li) {
    li.tabIndex = 0;
    li.focus();
}

async function findInStructure(collection, property) {
    for (const item of collection) {
        if (item.id === property || item.title === property) return item;

        if (item.children != null) {
            const childItem = await findInStructure(item.children, property);
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

    const previousOpenLi = li.parentElement.querySelector(".parent-menu-item[aria-expanded='true']");

    if (previousOpenLi != null) {
        await toggleExpansionState(previousOpenLi);
    }

    await toggleExpansionState(li);
    await assertViewportBoundary(li);
}

async function toggleExpansionState(li) {
    const isExpanded = li.getAttribute("aria-expanded") === "true";
    li.setAttribute("aria-expanded", !isExpanded);

    // We set the atViewportEdge attribute to false so that we recalculate the position of the submenu
    // This is to ensure that the submenu is always visible if the parent was already at the edge.
    const ul = li.querySelector(".submenu");
    ul.dataset.atViewportEdge = "false";
}

async function assertViewportBoundary(li) {
    const ul = li.querySelector(".submenu");
    const { left, width, height } = ul.getBoundingClientRect();

    // sets the first element in the submenu/ul to be focused when the submenu/ul is opened
    await setFocusState(ul.firstChild);

    //Checks if the available space is less than the width of the submenu/ul
    ul.dataset.atViewportEdge = window.innerWidth - left < width;

    //Todo: if this is not true I want to move the container hight up the screen
    const viewport = window.innerHeight - top > height
}

