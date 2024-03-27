import "./sla-measurement.js";

/**
 * class SlaMeasurementActions - A class that contains methods for the sla-measurement component
 */

export class SlaMeasurementActions {

    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method create - Creates the sla measurement component
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     * @param parent {Object} - The parent element to attach the component to
     * @param data {[Object]} - The array of objects where each object contains the data for the component
     */

    static async create(step, context, process, item, parent, data) {
        const parentContainer = await crs.dom.get_element(step.args.parent, context, process, item);
        const slaData = await crs.process.getValue(step.args.data, context, process, item);

        for (const item of slaData) {
            const element = document.createElement("sla-measurement");
            element.id = item.id;
            element.setAttribute("data-progress", item.measurements[0].progress);
            element.setAttribute("data-status", item.measurements[0].status);
            element.setAttribute("data-duration", item.measurements[0].duration);
            parentContainer.appendChild(element);
        }
    }

    /**
     * @method remove_sla - removes a sla measurement component by id
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     * @param id {String} - The id of the sla measurement component to remove
     */

    static async remove_sla(step, context, process, item, id) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const slaId = await crs.process.getValue(step.args.id, context, process, item);
        const slaElement = element.shadowRoot.querySelector(`[id="${slaId}"]`);


        if (slaElement != null) {
            slaElement.remove();
        }
    }

    /**
     * @method update - Updates the sla measurement data
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     *
     *
     * @returns {Promise<void>}
     */

    static async update(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const progress = await crs.process.getValue(step.args.progress || 0, context, process, item);

        const progressBar = element.shadowRoot.querySelector("div")
        progressBar.style.height = `${progress}%`;
        progressBar.dataset.progress = `${progress}%`;
    }
}

crs.intent.sla_measurement = SlaMeasurementActions;