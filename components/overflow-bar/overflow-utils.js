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

    // we need the button to be visible during initial measurement to ensure the overflow is calculated correctly
    btnOverflow.removeAttribute("aria-hidden");

    const overflowControlsWidth = await getOverflowControlsWidth(instance);
    const width = instance.offsetWidth;

    let right = 0;

    let hasOverflow = false;
    const children = instance.children;

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.dataset.ignore === "true") {
            child.setAttribute("aria-hidden", "true");
            continue;
        }

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

    if (hasOverflow == false) {
        btnOverflow.setAttribute("aria-hidden", "aria-hidden");
    }

    return hasOverflow;
}

export async function createOverflowFromCount(instance, btnOverflow, overflowContainer, count, useIcons, pinned) {
    await resetAllChildren(instance);

    const hasOverflow = instance.children.length > count;
    if (hasOverflow == false) return false;

    if (pinned == true) {
        count -= 1;
    }

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
    const isSelected = item.getAttribute("aria-selected") != null;

    const result = await crs.call("dom", "create_element", {
        tag_name: "li", parent, text_content,
        dataset: {
            id: item.dataset.id,
            action: item.dataset.action || "",
            icon
        }
    })

    if (item.dataset.invalid != null) {
        result.dataset.invalid = item.dataset.invalid;
    }

    if (isSelected) {
        result.setAttribute("aria-selected", "true");
    }

    return result;
}

async function createLiForText(item, parent) {
    const isSelected = item.getAttribute("aria-selected") != null;

    const result = await crs.call("dom", "create_element", {
        tag_name: "li", parent,
        text_content: item.textContent,
        dataset: {
            id: item.dataset.id,
            action: item.dataset.action || ""
        }
    })

    if (item.dataset.invalid != null) {
        result.dataset.invalid = item.dataset.invalid;
    }

    if (isSelected) {
        result.setAttribute("aria-selected", "true");
    }

    return result;
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
    await clearHighlighted(overflowContainer);

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

    await clearHighlighted(overflowContainer);
}

export async function setPinned(instance, action, id, textContent, icon, invalid) {
    const overflowCell = instance.shadowRoot.querySelector(".overflow-cell");

    delete instance.pinnedContent.dataset.invalid;

    instance.pinnedContent.removeAttribute("aria-hidden");
    instance.pinnedContent.textContent = textContent;
    instance.pinnedContent.dataset.id = id;
    instance.pinnedContent.dataset.action = action;

    if (invalid != null) {
        instance.pinnedContent.dataset.invalid = invalid;
    }

    overflowCell.classList.add("pinned");

    if (icon != null) {
        instance.pinnedContent.textContent = icon;
        instance.pinnedContent.setAttribute("title", textContent);
    }
}

export async function toggleSelection(selected, container) {
    if (selected == null) return;

    const current = container.querySelector('[aria-selected="true"]');
    current?.removeAttribute("aria-selected");

    const id = selected.dataset.id;
    const selectedElement = container.querySelector(`[data-id="${id}"]`);
    selectedElement?.setAttribute("aria-selected", "true");
}

function getOverflowControlsWidth(instance) {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            const overflowCell = instance.shadowRoot.querySelector(".overflow-cell");
            resolve(overflowCell.offsetWidth);
        })
    });
}

export async function moveHighlight(collection, direction) {
    const highlighted = collection.querySelector('.highlighted');
    if (highlighted == null) {
        const first = collection.querySelector('li');
        first?.classList.add('highlighted');
        return;
    }

    const nextHighlighted = direction == 1 ? highlighted.nextElementSibling : highlighted.previousElementSibling;
    if (nextHighlighted == null) return;

    highlighted.classList.remove('highlighted');
    nextHighlighted.classList.add('highlighted');
    return nextHighlighted;
}

export async function getHighlighted(collection) {
    return collection.querySelector('.highlighted');
}

async function clearHighlighted(collection) {
    const highlighted = collection.querySelector('.highlighted');
    highlighted?.classList.remove('highlighted');
}