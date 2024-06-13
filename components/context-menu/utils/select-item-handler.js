export async function handleSelection(li, options, component, filterHeader, isMobile = false, groupHeader= null) {
    if (li.matches(".parent-menu-item")) {
        await expandAndCollapseSubmenu(li,filterHeader, isMobile,groupHeader);
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

async function expandAndCollapseSubmenu(li, filterHeader, isMobile, groupHeader) {
    if (li.getAttribute("aria-expanded") === "true") {
        return toggleExpansionState(li);
    }

    const openedLiList = li.parentElement.querySelectorAll(".parent-menu-item[aria-expanded='true']");

    await assertExpandedState(openedLiList, li);
    await toggleExpansionState(li,filterHeader, isMobile,groupHeader);

    if(isMobile === true) return;

    await assertViewportBoundary(li);
}

async function assertExpandedState(openedLiList, li) {
    for (const openedLi of openedLiList) {
        if (openedLi === li) continue;

        await toggleExpansionState(openedLi);
    }
}

export async function toggleExpansionState(li, filterHeader, isMobile,groupHeader) {
    const isExpanded = li.getAttribute("aria-expanded") === "true";
    li.setAttribute("aria-expanded", !isExpanded);

    if(isMobile === true && isExpanded === false) {
        filterHeader.setAttribute("aria-hidden", true);
        groupHeader.setAttribute("aria-hidden", false);
        return;
    }

    // We set the atViewportEdge attribute to false so that we recalculate the position of the submenu
    // This is to ensure that the submenu is always visible if the parent was already at the edge.
    const ul = li.querySelector(".submenu");
    ul.dataset.onEdge = "false";
}

async function assertViewportBoundary(li) {
    const ul = li.querySelector(".submenu");
    const { left, width, height,top, bottom } = ul.getBoundingClientRect();

    // sets the first element in the submenu/ul to be focused when the submenu/ul is opened
    await setFocusState(ul.firstChild);

    //Checks if the available space is less than the width of the submenu/ul
    ul.dataset.onEdge = window.innerWidth - left < width;

    //Checks if the available space is less than the height of the submenu/ul and repositions the submenu/ul
    const hasExceededViewportBottomEdge = window.innerHeight - top > height;
    if (hasExceededViewportBottomEdge === false){
        const parentUl = ul.parentElement.parentElement;
        const parentUlBottom = parentUl.getBoundingClientRect().bottom;

        ul.style.top = `${parentUlBottom - bottom}px`;
    }
}

