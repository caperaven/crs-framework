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
            let count = 0;

            const element = document.createElement("sla-measurement");
            element.id = measurement.id;
            element.setAttribute("data-progress", measurement.progress);
            element.setAttribute("data-state", measurement.state); // Ask Rabie about this
            element.setAttribute("data-duration", measurement.duration);
            element.style.gridArea = `m_${measurement.id}`;

            parentElement.shadowRoot.appendChild(element);

            const measurementFooterContainer = document.createElement("div");
            measurementFooterContainer.classList.add("sla-footer-container");
            measurementFooterContainer.textContent = `${measurement.code}`
            measurementFooterContainer.style.gridArea = `f_${measurement.id}`;
            parentElement.shadowRoot.appendChild(measurementFooterContainer);

            count++;
            console.log(count);
        }

        for (const measurement of parentElement.shadowRoot.querySelectorAll("sla-measurement")) {
            await onSlaMeasurementLoading(measurement, async () => {
                await crs.call("sla_measurement", "update", { element: measurement, progress: measurement.dataset.progress});
            });
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

        const progressBar = element.shadowRoot.querySelector("div");
        progressBar.style.height = `${progress -10}%`;
        element.dataset.progress = `${progress}%`;
    }
}

async function performSlaMeasurementCallback(slaMeasurementElement, callback, resolve) {
    await callback();
    slaMeasurementElement.dataset.status = "loaded";
    resolve();
}

function onSlaMeasurementLoading(slaMeasurementElement, callback) {
    return new Promise(async resolve => {
        if (slaMeasurementElement.dataset.status === "loading") {
            await performSlaMeasurementCallback(slaMeasurementElement, callback, resolve);
        }

        slaMeasurementElement.addEventListener("loading-measurement", async () => {
            await performSlaMeasurementCallback(slaMeasurementElement, callback, resolve);
        });
    });
}

crs.intent.sla_measurement = SlaMeasurementActions;