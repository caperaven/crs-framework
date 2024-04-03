import "./sla-measurement.js";

/**
 * class SlaMeasurementActions - A class that contains methods for the sla-measurement component
 */

export class SlaMeasurementActions {

    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method createAll - Creates the sla measurement component
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     * @param parent {Object} - The parent element to attach the component to
     * @param data {[Object]} - The array of objects where each object contains the data for the component
     */

    static async create_all(step, context, process, item, parent, data) {
        const parentElement = await crs.dom.get_element(step.args.parent, context, process, item);
        const measurementData = await crs.process.getValue(step.args.data, context, process, item);

        for (const measurement of measurementData) {
            const me = document.createElement("div")
            me.style.background = "blue";
            me.style.gridArea = `m_${measurement.id}`;
            parentElement.shadowRoot.appendChild(me);
        }


        // for (const measurement of measurementData) {
        //     const element = document.createElement("sla-measurement");
        //     element.id = measurement.id;
        //     element.setAttribute("data-progress", measurement.progress);
        //     element.setAttribute("data-status", measurement.status);
        //     element.setAttribute("data-duration", measurement.duration);
        //     element.style.gridArea = `m_${measurement.id}`;
        //     parentElement.appendChild(element);
        // }
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