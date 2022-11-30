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
            item[idField] = item[idField] || items.indexOf(item); //NOTE KR: could be problematic
            item.selected === true ? data.selected.push(item) : data.available.push(item);
        }

        const ready = async () => {
            element.removeEventListener("ready", ready);
            element.data = data;
        }

        if (element.dataset.ready == "true") {
            await ready();
        } else {
            element.addEventListener("ready", ready);
        }
    }

    static async get_records(step, context, process, item) {
        const element = crs.dom.get_element(step.args.element)
        return element.data
    }
}

crs.intent.available_selected = AvailableSelectedActions;