export class AvailableSelectedActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async set_records(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const items = await crs.process.getValue(step.args.items);
        const idField = element.dataset.idField || "id";

        const data = {
            available: [],
            selected: []
        }

        for (const item of items) {
            item[idField] = item[idField] || items.indexOf(item);
            item.selected === true ? data.selected.push(item) : data.available.push(item);
        }

        const onReady = async () => {
            await element.update(data);
        }
        await crs.call("component", "on_ready", {element: element, callback: onReady, caller: this});
    }

    static async get_selected_records(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        return await element?.getSelectedItems();
    }
}

crs.intent.available_selected = AvailableSelectedActions;