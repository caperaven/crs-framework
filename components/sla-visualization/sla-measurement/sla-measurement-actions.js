import "./sla-measurement.js";

/**
 * class SlaMeasurementActions - A class that contains methods for the sla-measurement component
 */

export class SlaMeasurementActions {

    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method create_all - Creates the sla measurement component/s
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     */
    // Main create_all function
    static async create_all(step, context, process, item) {
        const parentElement = await crs.dom.get_element(step.args.parent, context, process, item);
        const measurementData = await crs.process.getValue(step.args.data, context, process, item);
        const measurementDataStatuses = await crs.process.getValue(step.args.statuses, context, process, item);
        const parentPhase = await crs.process.getValue(step.args.parentPhase, context, process, item); // refactor for phase

        for (const measurement of measurementData) {
            await addStatusNames(measurement, measurementDataStatuses);
            await createMeasurementElement(measurement, parentElement, parentPhase);
        }

        for (const measurement of parentElement.shadowRoot.querySelectorAll("sla-measurement")) {
            const measurementId = measurement.id;
            const correspondingMeasurementData = measurementData.find(measurement => measurement.id === measurementId);

            if (correspondingMeasurementData !== null && correspondingMeasurementData !== undefined) {
                await onSlaMeasurementLoading(measurement, async () => {
                    await crs.call("sla_measurement", "update", {
                        element: measurement,
                        measurementData: correspondingMeasurementData
                    });
                });
            }
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
    // Main update function
    static async update(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const measurementData = await crs.process.getValue(step.args.measurementData, context, process, item);

        // Update progress-related styles
        await updateProgressStyles(element, measurementData);

        // Create trigger indicators
        await createTriggerIndicators(element, measurementData);

        // Update status based on parent phase
        await updateStatus(element, measurementData);
    }

    /**
     * @method display_measurement_info - Displays the measurement info on hover
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     * @return {Promise<void>}
     */
    static async display_measurement_info(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const type = await crs.process.getValue(step.args.type, context, process, item);
        const measurementData = {
            code: element.dataset.code,
            startStatus: element.getAttribute("data-start-status-name", ""),
            endStatus: element.getAttribute("data-end-status-name", ""),
            duration: element.dataset.duration,
            progress: element.dataset.progress,
            nextTrigger: element.shadowRoot.querySelector(".measurement-trigger-indicator") !== null ? `${element.shadowRoot.querySelector(".measurement-trigger-indicator").dataset?.trigger}` : "",
            triggerType: element.shadowRoot.querySelector(".measurement-trigger-indicator") !== null ? `${element.shadowRoot.querySelector(".measurement-trigger-indicator").dataset?.triggerType}` : "",
            NumOfTriggers: element.shadowRoot.querySelectorAll(".measurement-trigger-indicator").length
        }

        if (element.dataset.parentPhase === "runtime" || element.dataset.parentPhase === "setup") {
            let templateSelector, backgroundStyle;

            if (element.dataset.parentPhase === "runtime") {
                templateSelector = "template.runtime-measurement-info-template";
            }
            else if (element.dataset.parentPhase === "setup") {
                templateSelector = "template.setup-measurement-info-template";
                backgroundStyle = type === "mouseenter" ? "#075E96" : "var(--blue)";
            }

            const measurementInfoTemplate = element.shadowRoot.querySelector(templateSelector);
            const measurementInfo = measurementInfoTemplate.content.cloneNode(true);

            await crs.binding.staticInflationManager.inflateElement(measurementInfo.firstElementChild, measurementData);
            element.shadowRoot.appendChild(measurementInfo);

            const measurementInfoElement = element.shadowRoot.querySelector(".measurement-info");
            measurementInfoElement.style.display = type === "mouseenter" ? "flex" : "none";
            element.style.background = backgroundStyle;
        }


        // call function that positions tooltip correctly ToDo: AW : Implement this function

    }

    /**
     * @method select_measurement - Selects the measurement
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     * @return {Promise<null|*>}
     */
    static async select_measurement(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const measurementParent = await crs.dom.get_element(step.args.measurementParent, context, process, item);
        const measurementOverlay = measurementParent.shadowRoot.querySelector(`#m_${element.id}.measurement-overlay`);

        // toggle selected class if selected is true or false on measurementOverlay
        // Check if data-selected attribute exists
        const isSelected = measurementOverlay.getAttribute("data-selected") === "true";

        measurementOverlay.setAttribute("data-selected", isSelected ? "false" : "true");
        element.dataset.selected = isSelected ? "false" : "true";

        measurementOverlay.style.opacity = isSelected ? "0" : "1";

        return element;
    }

    /**
     * @method remove_measurement - Removes the measurement from the visualization
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     * @return {Promise<void>}
     */
    static async remove_measurement(step, context, process, item) {
        const parentElement = await crs.dom.get_element(step.args.element, context, process, item);
        const selectedMeasurements = parentElement.shadowRoot.querySelector("sla-layer").shadowRoot.querySelectorAll("sla-measurement[data-selected='true']");
        const measurementOverlay = parentElement.shadowRoot.querySelector("sla-layer").shadowRoot.querySelectorAll(`[data-selected='true']`)

        for (const measurement of selectedMeasurements) {
            const selectedMeasurementsFooters = parentElement.shadowRoot.querySelector("sla-layer").shadowRoot.querySelectorAll("div.sla-footer-container");
            for (const footer of selectedMeasurementsFooters) {
                // if measurement id is equal to footer id, remove the footer
                if (measurement.id === footer.id.split("_")[1]) {
                    footer.remove();
                }
            }

            measurement.dataset.selected = "false";
            measurement.remove();
        }

        for (const overlay of measurementOverlay) {
            overlay.dataset.selected = "false";
            overlay.style.opacity = "0";
        }
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


// Function to add start_status_name and end_status_name properties to measurement object
async function addStatusNames(measurement, measurementDataStatuses) {
    const startStatus = measurementDataStatuses.find(status => status.id === measurement.start_status);
    const endStatus = measurementDataStatuses.find(status => status.id === measurement.end_status);

    if (startStatus) {
        measurement.start_status_name = startStatus.name;
    }
    if (endStatus) {
        measurement.end_status_name = endStatus.name;
    }
}

// Function to create measurement element
async function createMeasurementElement(measurement, parentElement, parentPhase) {
    const element = document.createElement("sla-measurement");
    element.id = measurement.id;
    element.dataset.code = measurement.code;
    element.setAttribute("data-progress", measurement.progress);
    element.setAttribute("data-state", measurement.state);
    element.setAttribute("data-duration", measurement.duration);
    element.setAttribute("data-start-status", measurement.start_status);
    element.setAttribute("data-end-status", measurement.end_status);
    element.setAttribute("data-parent-phase", parentPhase);
    element.dataset.activeRow = parentElement.dataset.activeRow;

    if (measurement.start_status_name) {
        element.setAttribute("data-start-status-name", measurement.start_status_name);
    }
    if (measurement.end_status_name) {
        element.setAttribute("data-end-status-name", measurement.end_status_name);
    }

    element.style.gridArea = `m_${measurement.id}`;

    parentElement.shadowRoot.appendChild(element);

    const measurementFooterContainer = document.createElement("div");
    measurementFooterContainer.classList.add("sla-footer-container");
    measurementFooterContainer.id = `f_${measurement.id}`;
    measurementFooterContainer.textContent = `${measurement.code}`
    measurementFooterContainer.style.gridArea = `f_${measurement.id}`;
    parentElement.shadowRoot.appendChild(measurementFooterContainer);
}

// Function to update progress-related styles
/**
 * @method updateProgressStyles - Updates the progress-related styles
 * @param element {HTMLElement} - The sla-measurement element
 * @param measurementData {Object} - The measurement data object
 * @return {Promise<void>}
 */
async function updateProgressStyles(element, measurementData) {
    const progressBar = element.shadowRoot.querySelector("div.progress-bar");
    progressBar.style.height = `${Math.min(measurementData.progress, 100) - 7}%`;
    element.dataset.progress = `${measurementData.progress}%`;

    if (measurementData.progress > 100) {
        element.classList.add("measurement-overdue-state");
    } else if (measurementData.progress >= 80 && measurementData.progress <= 99) {
        element.classList.add("measurement-warning-state");
    }
}

// Function to create trigger indicators
/**
 * @method createTriggerIndicators - Creates the trigger indicators
 * @param element {HTMLElement} - The sla-measurement element
 * @param measurementData {Object} - The measurement data object
 * @return {Promise<void>}
 */
async function createTriggerIndicators(element, measurementData) {
    if (measurementData.triggers?.length > 0) {
        for (const trigger of measurementData.triggers) {
            const triggerIndicator = document.createElement("div");
            triggerIndicator.id = `trigger_${trigger.id}`;
            triggerIndicator.dataset.trigger = `${trigger.trigger}%`;
            triggerIndicator.dataset.triggerType = trigger.type !== null ? trigger.type : "";
            triggerIndicator.classList.add("measurement-trigger-indicator");
            triggerIndicator.style.bottom = `${trigger.trigger}%`;
            trigger.trigger === 0 ? triggerIndicator.style.opacity = "0" : triggerIndicator.style.opacity = "1";
            element.shadowRoot.appendChild(triggerIndicator);
        }
    }
}

// Function to update status based on parent phase
/**
 * @method updateStatus - Updates the status based on the parent phase
 * @param element {HTMLElement} - The sla-measurement element
 * @param measurementData {Object} - The measurement data object
 * @return {Promise<void>}
 */
async function updateStatus(element, measurementData) {
    if (element.dataset.parentPhase === "runtime") {
        if (element.dataset.activeRow < measurementData.start_status || element.dataset.activeRow > measurementData.end_status) {
            element.dataset.state = "inactive";
        }
    }
}



crs.intent.sla_measurement = SlaMeasurementActions;