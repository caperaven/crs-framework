export async function handleSelection(li, options, component, filterHeader) {
    if (li.matches(".parent-menu-item")) {
        filterHeader.clear();
        await expandAndCollapseSubmenu(li);
        return;
    }

    //if the element does not have an id I want to do the comparison against its title
    const option = await findInStructure(options, li.id );

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

    const openedLiList = li.parentElement.querySelectorAll(".parent-menu-item[aria-expanded='true']");

    await assertExpandedState(openedLiList, li);
    await toggleExpansionState(li);
    await assertViewportBoundary(li);
}

async function assertExpandedState(openedLiList, li) {
    for (const openedLi of openedLiList) {
        if (openedLi === li) continue;

        await toggleExpansionState(openedLi);
    }
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
    const { left, width, height,top, bottom } = ul.getBoundingClientRect();

    // sets the first element in the submenu/ul to be focused when the submenu/ul is opened
    await setFocusState(ul.firstChild);

    //Checks if the available space is less than the width of the submenu/ul
    ul.dataset.atViewportEdge = window.innerWidth - left < width;

    //Checks if the available space is less than the height of the submenu/ul and repositions the submenu/ul
    const hasExceededViewportBottomEdge = window.innerHeight - top > height;
    if (hasExceededViewportBottomEdge === false){
        const parentUl = ul.parentElement.parentElement;
        const parentUlBottom = parentUl.getBoundingClientRect().bottom;

        ul.style.top = `${parentUlBottom - bottom}px`;
    }
}

