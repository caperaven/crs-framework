export async function handleSelection(element, options, component, filterHeader) {
    const li = await crs.call("dom_utils", "find_parent_of_type", {
        element: element,
        nodeName: "li",
        stopAtNodeName: "ul"
    });

    if ((li == null || li?.parentElement.dataset.closable == null) && element.id !== "input-filter") {
        return "close";
    }

    if (li != null && li.matches(".parent-menu-item")) {
        filterHeader.clear();
        await expandAndCollapseSubmenu(element);
        await verifyViewportBoundary(element)
        return;
    }

    const option = await findInStructure(options, li.id);

    if (option.type != null) {
        crs.call(option.type, option.action, option.args);
    }

    component.dataset.value = option.id;
    component.dispatchEvent(new CustomEvent("change", {detail: option}));

    await crs.call("context_menu", "close");
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
    const subMenuParentList = element.parentElement.querySelectorAll(".parent-menu-item[aria-expanded='true']");

    for (const subMenuParent of subMenuParentList) {
        const isExpanded = subMenuParent.getAttribute("aria-expanded") === "true";
        if (subMenuParent !== element && isExpanded) {
            subMenuParent.setAttribute("aria-expanded", "false");
            const subMenu = subMenuParent.querySelector(".submenu");
            subMenu.dataset.edge = "false";
        }
    }
}

async function verifyViewportBoundary(element) {
    if (element == null) return false;
    const submenu = element.querySelector(".submenu");
    const isExpanded = element.getAttribute("aria-expanded") === "true";

    element.setAttribute("aria-expanded", !isExpanded);

    const viewportWidth = window.innerWidth;
    const { left, width } = submenu.getBoundingClientRect();

    submenu.dataset.edge = viewportWidth - left < width ? "true" : "false";
}