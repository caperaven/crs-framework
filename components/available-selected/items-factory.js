export class ItemsFactory {
    static async #base(templateToInflate, collection, idFieldText) {
        return await this.createElement("li", templateToInflate, {
            classes: [collection],
            dataset: {id: idFieldText}
        });
    }

    static async #button(parent, action, text_content) {
        await this.createElement("button", parent, {
            classes: ["icon"],
            dataset: {action: action},
            text_content: text_content,
        });
    }

    static async #label(parent, idFieldText) {
        return await this.createElement("label", parent, {
            text_content: idFieldText,
        });
    }

    static async #buildInflationTemplate(element, collection) {
        const templateToInflate = document.createElement("template");
        const idFieldText = ["${", (element.dataset.idField || "id"), "}"].join("");

        const li = await this.#base(templateToInflate, collection, idFieldText);

        const label = await this.#label(null, idFieldText);
        if(element.dataset.drag === "true" && collection === "selected") {
            await this.#button(li,  "drag", "drag-hori");
            label.dataset.action = "drag";
        }

        li.appendChild(label);

        if(element.dataset.drillDown === "true" && collection === "selected") {
            await this.#button(li,  "drill", "chevron-right");
            label.dataset.action = "drill";
        }

        const toggleText = collection === "available" ? "add-circle-outline" : "minus-circle-outline";
        await this.#button(li,  "toggle", toggleText);
        return templateToInflate;
    }

    static async #inflate(templateToInflate, data, collection) {
        const template = document.createElement("template");
        for (const item of data[collection]) {
            const inflatedTemplateContent = await crs.call("html", "create", {html: templateToInflate.innerHTML, ctx: item});
            await template.content.appendChild(inflatedTemplateContent);
        }
        return template;
    }

    static async createElement(element, parent, options) {
        return await crs.call("dom", "create_element", {
            parent: parent,
            tag_name: element,
            classes: options.classes || [],
            dataset: options.dataset || {},
            attributes: options.attributes || {},
            text_content: options.text_content || null
        });
    }

    static async createTemplate(element, currentView, collection, data) {
        const templateToInflate = await this.#buildInflationTemplate(element, collection);
        const resultTemplate = await this.#inflate(templateToInflate, data, collection);
        resultTemplate.dataset.id = collection;
        if (currentView == collection) resultTemplate.dataset.default = "true";
        return resultTemplate;
    }
}