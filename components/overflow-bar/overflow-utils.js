export async function createOverflowItems(overflow, btnOverflow, overflowContainer) {
    const width = overflow.offsetWidth;
    let right = 0;

    let hasOverflow = false;
    const children = overflow.children;
    overflow.overflow.innerHTML = "";
    btnOverflow.setAttribute("aria-hidden", "true");

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (hasOverflow) {
            child.setAttribute("aria-hidden", "true");
            await addItemToOverflow(child, overflowContainer);
            continue;
        }

        right += child.offsetWidth;
        if (right > width) {
            await addItemToOverflow(child, overflowContainer);
            child.setAttribute("aria-hidden", "true");
            hasOverflow = true;
        }
    }

    if (hasOverflow) {
        btnOverflow.removeAttribute("aria-hidden");
    }
}

async function addItemToOverflow(item, overflowContainer) {
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

export async function showOverflow(overflow, btnOverflow, overflowContainer) {
    const isMobile = await crs.call("system", "is_mobile", {});

    if (isMobile === true) {
        await showFullscreen(overflowContainer);
    }
    else {
        await showRelative(overflow, btnOverflow, overflowContainer);
    }

    overflow.dialogOpen = true;
}

async function showRelative(overflow, btnOverflow, overflowContainer) {
    overflow.background = await crs.call("dom", "create_element", {
        tag_name: "div", parent: overflow,
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

async function showFullscreen(overflowContainer) {
    overflowContainer.style.position = "fixed";
    overflowContainer.style.top = 0;
    overflowContainer.style.left = 0;
    overflowContainer.style.right = 0;
    overflowContainer.style.bottom = 0;
    overflowContainer.removeAttribute("aria-hidden");
}

export async function closeOverflow(overflow, overflowContainer) {
    overflow.background?.remove();
    overflow.background = null;
    overflowContainer.setAttribute("aria-hidden", "true");
    overflow.dialogOpen = false;
}
