export async function handleSelection(li, options, component, filterHeader) {
    if (li.matches(".parent-menu-item")) {
        filterHeader.clear();
        await expandAndCollapseSubmenu(li);
        await verifyViewportBoundary(li)
        return;
    }

    const option = await findInStructure(options, li.id);

    if (option.type != null) {
        // if a step we don't wait for the result as the context menu should close immediately
        crs.call(option.type, option.action, option.args);
    }

    component.dataset.value = option.id;
    component.dispatchEvent(new CustomEvent("change", {detail: option}));

    await crs.call("context_menu", "close");
}

export async function setTabIndex(element,siblingType) {
    let siblingElement = element[siblingType];
    if (siblingElement != null) {
        element.tabIndex = -1;
        siblingElement.tabIndex = 0;
        siblingElement.focus();
    }
}

async function findInStructure(collection, id) {
    for (const item of collection) {
        if (item.id == id) return item;

        if (item.children != null) {
            const childItem = await findInStructure(item.children, id);
            if (childItem != null) {
                return childItem;
            }
        }
    }
}

async function expandAndCollapseSubmenu(element) {
    const subMenuParent = element.parentElement.querySelector(".parent-menu-item[aria-expanded='true']");

    if (subMenuParent != null) {
        await toggleExpansionState(subMenuParent);
    }

    if (subMenuParent === element) return;

    await toggleExpansionState(element);
}

async function toggleExpansionState(element) {
    const isExpanded = element.getAttribute("aria-expanded") === "true";
    element.setAttribute("aria-expanded", !isExpanded);
    const submenu = element.querySelector(".submenu");
    submenu.dataset.atViewportEdge = "false";
}

async function verifyViewportBoundary(element) {
    if (element == null) return;

    const submenu = element.querySelector(".submenu");
    const { left, width } = submenu.getBoundingClientRect();

    const firstChild = submenu.firstChild;
    firstChild.tabIndex = firstChild.tabIndex === -1 ? 0 : -1;
    firstChild.focus();
    submenu.dataset.atViewportEdge = window.innerWidth - left < width;
}