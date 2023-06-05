/**
 * @method buildElements - Builds the elements for the context menu.
 * @returns {Promise<void>}
 */
export async function buildElements(options, templates, context, container) {
    const fragment = document.createDocumentFragment();

    await createListItems(fragment, options, templates);

    container.innerHTML = "";
    container.appendChild(fragment);

    const isHierarchical = container.querySelector(".parent-menu-item") != null;
    if (isHierarchical === true) {
        container.classList.add("hierarchy")
    }

    if (context) {
        await crsbinding.staticInflationManager.inflateElements(container.children, context);
    }

    return isHierarchical;
}

/**
 * @method createListItems - Creates the list items for the context menu.
 * @param parentElement {HTMLElement} - The parent element to add the list items to.
 * @param collection {Array} - The collection of options to create the list items from.
 * @param templates {Object} - The templates to use when creating the list items.
 * @returns {Promise<void>}
 */
async function createListItems(parentElement, collection, templates) {
    for (const option of collection) {
        if (option.title?.trim() == "-") {
            parentElement.appendChild(document.createElement("hr"));
            continue;
        }

        const li = await crs.call("dom", "create_element", {
            parent: parentElement,
            id: option.id,
            tag_name: "li",
            dataset: {
                icon: option.icon,
                ic: option.icon_color || "black",
                tags: option.tags || "",
                ...(option.dataset || {})
            },
            attributes: {
                role: "menuitem",
                "aria-selected": option.selected == true,
                ...(option.attributes || {})
            },
            styles: option.styles,
            variables: {
                "--cl-icon": option.icon_color || "black"
            }
        });

        if (templates != null && option.template != null) {
            const template = templates[option.template];
            const fragment = await crs.call("html", "create", {
                ctx: option,
                html: template
            });
            li.appendChild(fragment);
        }
        else {
            if (option.children == null) {
                li.textContent = option.title;
            }
            else {
                li.classList.add("parent-menu-item")

                await crs.call("dom", "create_element", {
                    parent: li,
                    tag_name: "div",
                    text_content: option.title
                });

                const ul = await crs.call("dom", "create_element", {
                    parent: li,
                    tag_name: "ul",
                    classes: ["submenu"]
                });

                await createListItems(ul, option.children, templates);
            }
        }
    }
}