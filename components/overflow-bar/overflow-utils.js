/**
 * @method createOverflowItems - this function measures the children and if the children overflow the parent,
 * they are made to be invisible. Additionally, they list items representing those items are created.
 * The original items are not removed in case the UI resizes and this operation needs to be performed again.
 * @param instance {OverflowBar} - the instance of the overflow bar
 * @param btnOverflow - the button that opens the overflow
 * @param overflowContainer - the container that holds the overflow items, normally a UL
 * @returns {Promise<void>}
 */
export async function createOverflowItems(instance, btnOverflow, overflowContainer) {
    await resetAllChildren(instance);

    const width = instance.offsetWidth;
    let right = 0;

    let hasOverflow = false;
    const children = instance.children;
    instance.overflow.innerHTML = "";
    btnOverflow.setAttribute("aria-hidden", "true");

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (hasOverflow) {
            await addItemToOverflow(child, overflowContainer);
            continue;
        }

        right += child.offsetWidth;
        if (right > (width - 32)) {
            await addItemToOverflow(child, overflowContainer);
            hasOverflow = true;
        }
    }

    if (hasOverflow) {
        btnOverflow.removeAttribute("aria-hidden");
    }

    return hasOverflow;
}

export async function createOverflowFromCount(instance, btnOverflow, overflowContainer, count) {
    await resetAllChildren(instance);

    const hasOverflow = instance.children.length > count;
    if (hasOverflow == false) return false;

    for (let i = count; i < instance.children.length; i++) {
        const child = instance.children[i];
        child.setAttribute("aria-hidden", "true");
        await addItemToOverflow(child, overflowContainer);
    }

    btnOverflow.removeAttribute("aria-hidden");
    return true;
}

async function resetAllChildren(instance) {
    for (const child of instance.children) {
        child.removeAttribute("aria-hidden");
    }
}

/**
 * @method addItemToOverflow - this function creates an item in the overflow container
 * @param item - the item to be added to the overflow container
 * @param overflowContainer - the container that holds the overflow items, normally a UL
 * @returns {Promise<void>}
 */
async function addItemToOverflow(item, overflowContainer) {
    item.setAttribute("aria-hidden", "true");

    await crs.call("dom", "create_element", {
        tag_name: "li", parent: overflowContainer,
        text_content: item.textContent,
        dataset: {
            id: item.dataset.id,
            action: item.dataset.action || "",
            icon: item.dataset.icon || ""
        }
    })
}

/**
 * @method showOverflow - this function shows the overflow container as a popup
 * If it is a mobile device this will be full screen, else it is shown relative to the overflow button
 * @param instance {OverflowBar} - the instance of the overflow bar
 * @param btnOverflow - the button that opens the overflow
 * @param overflowContainer - the container that holds the overflow items, normally a UL
 * @returns {Promise<void>}
 */
export async function showOverflow(instance, btnOverflow, overflowContainer) {
    const isMobile = await crs.call("system", "is_mobile", {});

    if (isMobile === true) {
        await showFullscreen(overflowContainer);
    }
    else {
        await showRelative(instance, btnOverflow, overflowContainer);
    }

    instance.dialogOpen = true;
}

/**
 * @method showRelative - this function shows the overflow container relative to the overflow button
 * @param instance
 * @param btnOverflow
 * @param overflowContainer
 * @returns {Promise<void>}
 */
async function showRelative(instance, btnOverflow, overflowContainer) {
    instance.background = await crs.call("dom", "create_element", {
        tag_name: "div", parent: instance,
        styles: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "transparent",
        }
    })

    overflowContainer.style.opacity = 0;
    overflowContainer.removeAttribute("aria-hidden");

    await crs.call("fixed_layout", "set", {
        target: btnOverflow,
        element: overflowContainer,
        at: "bottom",
        anchor: "right"
    });

    requestAnimationFrame(() => {
        overflowContainer.style.opacity = 1;
    })
}

/**
 * @method showFullscreen - this function shows the overflow container as a full screen popup
 * @param overflowContainer
 * @returns {Promise<void>}
 */
async function showFullscreen(overflowContainer) {
    overflowContainer.style.position = "fixed";
    overflowContainer.style.top = 0;
    overflowContainer.style.left = 0;
    overflowContainer.style.right = 0;
    overflowContainer.style.bottom = 0;
    overflowContainer.removeAttribute("aria-hidden");
}

/**
 * @method closeOverflow - this function closes the overflow container
 * @param overflow
 * @param overflowContainer
 * @returns {Promise<void>}
 */
export async function closeOverflow(overflow, overflowContainer) {
    overflow.background?.remove();
    overflow.background = null;
    overflowContainer.setAttribute("aria-hidden", "true");
    overflow.dialogOpen = false;
}

export async function setPinned(instance, pinned, action, id, textContent) {

}