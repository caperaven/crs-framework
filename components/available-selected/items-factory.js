export class ItemsFactory {
    static async createElement(options, record) {
        return await crs.call("dom_binding", "elements_from_template", {
            template_id: options.template_id,
            template: options.template,
            data: record,
            remove_template: options.remove_template || false,
            recycle: options.recycle || false,
            row_index: options.row_index || 0,
            parent: options.parent,
        });
    }

    static async createElements(options, records) {
        const docFrag = document.createDocumentFragment();
        for (const record of records) {
            const elementFrag = await this.createElement(options, record);
            docFrag.appendChild(elementFrag);
        }

        return docFrag;
    }
}