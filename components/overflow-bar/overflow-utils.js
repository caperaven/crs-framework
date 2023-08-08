/**
 * @method createOverflowItems - this function measures the children and if the children overflow the parent,
 * they are made to be invisible. Additionally, they list items representing those items are created.
 * The original items are not removed in case the UI resizes and this operation needs to be performed again.
 * @param instance {OverflowBar} - the instance of the overflow bar
 * @param btnOverflow - the button that opens the overflow
 * @param overflowContainer - the container that holds the overflow items, normally a UL
 * @returns {Promise<void>}
 */
export async function createOverflowItems(instance, btnOverflow, overflowContainer, useIcons) {
    await resetAllChildren(instance);

    const overflowControlsWidth = await getOverflowControlsWidth(instance);
    const width = instance.offsetWidth;

    let right = 0;

    let hasOverflow = false;
    const children = instance.children;
    btnOverflow.setAttribute("aria-hidden", "true");

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (hasOverflow) {
            await addItemToOverflow(child, overflowContainer, useIcons);
            continue;
        }

        right += child.offsetWidth;
        if (right > (width - overflowControlsWidth)) {
            await addItemToOverflow(child, overflowContainer, useIcons);
            hasOverflow = true;
        }
    }

    if (hasOverflow) {
        btnOverflow.removeAttribute("aria-hidden");
    }

    return hasOverflow;
}

export async function createOverflowFromCount(instance, btnOverflow, overflowContainer, count, useIcons) {
    await resetAllChildren(instance);

    const hasOverflow = instance.children.length > count;
    if (hasOverflow == false) return false;

    for (let i = count; i < instance.children.length; i++) {
        const child = instance.children[i];
        child.setAttribute("aria-hidden", "true");
        await addItemToOverflow(child, overflowContainer, useIcons);
    }

    btnOverflow.removeAttribute("aria-hidden");
    return true;
}

async function resetAllChildren(instance) {
    for (const child of instance.children) {
        child.removeAttribute("aria-hidden");
    }

    instance.overflow.innerHTML = "";
}

/**
 * @method addItemToOverflow - this function creates an item in the overflow container
 * @param item - the item to be added to the overflow container
 * @param overflowContainer - the container that holds the overflow items, normally a UL
 * @returns {Promise<void>}
 */
async function addItemToOverflow(item, overflowContainer, useIcons) {
    item.setAttribute("aria-hidden", "true");

    if (useIcons === true) {
        return await createLiForIcons(item, overflowContainer);
    }

    await createLiForText(item, overflowContainer);
}

async function createLiForIcons(item, parent) {
    const icon = item.textContent;
    const text_content = item.getAttribute("title");

    await crs.call("dom", "create_element", {
        tag_name: "li", parent, text_content,
        dataset: {
            id: item.dataset.id,
            action: item.dataset.action || "",
            icon
        }
    })
}

async function createLiForText(item, parent) {
    await crs.call("dom", "create_element", {
        tag_name: "li", parent,
        text_content: item.textContent,
        dataset: {
            id: item.dataset.id,
            action: item.dataset.action || ""
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

export async function setPinned(instance, pinned, action, id, textContent, icon) {
    const overflowCell = instance.shadowRoot.querySelector(".overflow-cell");

    if (pinned === false) {
        instance.pinnedContent.textContent = "";
        instance.pinnedContent.setAttribute("aria-hidden", "true");
        overflowCell.classList.remove("pinned");
        delete instance.dataset.id;
        delete instance.dataset.action;
        return;
    }

    instance.pinnedContent.removeAttribute("aria-hidden");
    instance.pinnedContent.textContent = textContent;
    instance.pinnedContent.dataset.id = id;
    instance.pinnedContent.dataset.action = action;
    overflowCell.classList.add("pinned");

    if (icon != null) {
        instance.pinnedContent.textContent = icon;
        instance.pinnedContent.setAttribute("title", textContent);
    }
}

function getOverflowControlsWidth(instance) {
    return new Promise(resolve => {
        const overflowCell = instance.shadowRoot.querySelector(".overflow-cell");
        resolve(overflowCell.offsetWidth);
    });
}