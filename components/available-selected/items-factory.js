/**
 * @class ItemsFactory - This class will create the items for the available-selected component.
 *
 * Features:
 * - createTemplate - This method will create the template for the available and selected items.
 * - createElement - This method will create an element.
 */
export class ItemsFactory {
    /**
     * @method createTemplate - This method will create the template for the available and selected items.
     * @param element
     * @param collection
     * @param data
     * @returns {Promise<HTMLTemplateElement>}
     */
    static async createTemplate(element, collection, data) {
        const templateToInflate = await buildInflationTemplate(element, collection);
        const resultTemplate = await createListFragment(templateToInflate, data, collection);
        return resultTemplate;
    }
}

/**
 * @function #createListItem - This function will create the base element for the template to inflate.
 * The element type is an Li element.
 * @param templateToInflate {HTMLTemplateElement} - The element to use as parent.
 * @param collection {String} - The collection to create the element for.
 * @param idFieldText {String} - The id field text to use.
 * @returns {Promise<*>}
 */
async function createListItem(templateToInflate, collection, idFieldText) {
    return await createElement("li", templateToInflate, {
        classes: [collection],
        dataset: {id: idFieldText}
    });
}

/**
 * @function #createButtonElement - This function will create a button element.
 * @param parent {HTMLElement} - The element to use as parent.
 * @param action {String} - The action to use.
 * @param text_content {String} - The text content to use as button text.
 * @param attributes {Object} - The attributes to use.
 * @returns {Promise<void>}
 */
async function createButtonElement(parent, action, text_content, attributes = {}) {
    await createElement("button", parent, {
        classes: ["icon"],
        dataset: {action: action},
        attributes: attributes,
        text_content: text_content,
    });
}

/**
 * @function #createLabelElement - This function will create a label element.
 * @param parent {HTMLElement} - The element to use as parent.
 * @param idFieldText {String} - The id field text to use.
 * @returns {Promise<*>}
 */
async function createLabelElement(parent, idFieldText) {
    return await createElement("label", parent, {
        text_content: idFieldText,
    });
}

/**
 * @function buildInflationTemplate - This function will create the template for the available and selected items.
 * @param element {HTMLElement} - The element to use as parent.
 * @param collection {String} - The collection to create the element for.
 * @returns {Promise<HTMLTemplateElement>}
 */
async function buildInflationTemplate(element, collection) {
    const templateToInflate = document.createElement("template");
    const idFieldText = ["${", (element.dataset.idField || "id"), "}"].join("");

    const li = await createListItem(templateToInflate, collection, idFieldText);

    const label = await createLabelElement(null, idFieldText);
    if(element.dataset.drag === "true" && collection === "selected") {
        await createButtonElement(li,  "drag", "drag-hori", {draggable: true});
        label.dataset.action = "drag";
    }

    li.appendChild(label);

    if(element.dataset.drillDown === "true" && collection === "selected") {
        await createButtonElement(li,  "drill", "chevron-right");
        label.dataset.action = "drill";
    }

    const toggleText = collection === "available" ? "add-circle-outline" : "minus-circle-outline";
    await createButtonElement(li,  "toggle", toggleText);
    return templateToInflate;
}

/**
 * @function createListFragment - This function will create the list fragment for the available and selected items.
 * @param templateToInflate {HTMLTemplateElement} - The element to use as parent.
 * @param data {Object} - The data to use.
 * @param collection {String} - The collection to create the element for.
 * @returns {Promise<HTMLTemplateElement>}
 */
async function createListFragment(templateToInflate, data, collection) {
    const fragment = document.createDocumentFragment();
    for (const item of data[collection]) {
        const inflatedTemplateContent = await crs.call("html", "create", {html: templateToInflate.innerHTML, ctx: item});
        await fragment.appendChild(inflatedTemplateContent);
    }

    return fragment;
}

/**
 * @function createElement - This function will create an element.
 * @param tagName {String} - The element to create.
 * @param parent {HTMLElement} - The element to use as parent.
 * @param options {Object} - The options to use.
 * @returns {Promise<*>}
 */
async function createElement(tagName, parent, options) {
    return await crs.call("dom", "create_element", {
        parent: parent,
        tag_name: tagName,
        classes: options.classes || [],
        dataset: options.dataset || {},
        attributes: options.attributes || {},
        text_content: options.text_content || null
    });
}

