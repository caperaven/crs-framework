import "./sla-measurement.js";
import {buildStandardElement} from "../sla-utils/sla-grid-utils.js";

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

        let incrementor = 0;
        const documentFragment = document.createDocumentFragment();
        for (const measurement of measurementData) {
            measurement.incrementor = incrementor;
            await addStatusNames(measurement, measurementDataStatuses);
            const measureElement = await createMeasurementElement(measurement, parentElement, parentPhase);

            await onSlaMeasurementLoading(measureElement, async () => {
                await crs.call("sla_measurement", "update", {
                    element: measureElement,
                    measurementData: measurement
                });
            });
            const tagName = "div"
            const measurementOverlay = await buildStandardElement(tagName,`m_${measurement.id}`,"measurement-overlay",null,`m${incrementor}`,`2 / span`);
            documentFragment.appendChild(measurementOverlay);

            const measurementFooterContainer = await buildStandardElement(tagName,`f_${measurement.id}`,"sla-footer-container",null,`f${incrementor}`);
            measurementFooterContainer.dataset.footerContent = measurement.code;
            documentFragment.appendChild(measurementFooterContainer);

            incrementor++;
        }
        parentElement.shadowRoot.appendChild(documentFragment);
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
     * @method inflate_measurement_info_template - this will inflate the measurement info template
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     *
     * @param step.args.element {HTMLElement} - The element to inflate the measurement info template
     * @param step.args.type {String} - The type of event
     * @param step.args.measurement_data {Object} - The measurement data object
     * @return {Promise<Node>}
     */
    static async inflate_measurement_info_template(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const type = await crs.process.getValue(step.args.type, context, process, item);
        const measurementData = await crs.process.getValue(step.args.measurement_data, context, process, item) ?? {};

        let templateSelector, backgroundStyle;
        const parentPhase = element.dataset.parentPhase;

        if (parentPhase === "runtime") {
            templateSelector = "template.runtime-measurement-info-template";
        }
        else {
            templateSelector = "template.setup-measurement-info-template";
            backgroundStyle = type === "mouseenter" ? "#075E96" : "var(--blue)"; // Add class .selected
        }

        const measurementInfoTemplate = element.shadowRoot.querySelector(templateSelector).content.firstElementChild.cloneNode(true);
        measurementInfoTemplate.dataset.id = `m-${element.id}`;

        await crsbinding.staticInflationManager.inflateElement(measurementInfoTemplate, measurementData);

        // Create a <link> element and add to header for measurement-info
        // We should do this when the connectedCallback of the main sla-component fires.
        const link = document.createElement("link");
        const baseUrl = window.location.origin + window.location.pathname.split("/").slice(0, -1).join("/");
        link.rel = "stylesheet";
        // link.href = `${baseUrl}/packages/crs-framework/components/sla-visualization/sla-measurement/sla-measurement-info.css`;
        link.href = `./components/sla-visualization/sla-measurement/sla-measurement-info.css`;
        document.head.appendChild(link);
        document.body.appendChild(measurementInfoTemplate);

        measurementInfoTemplate.style.zIndex = 999999
        return measurementInfoTemplate;
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
    const startStatus = measurementDataStatuses[measurement.start_status];
    const endStatus = measurementDataStatuses[measurement.end_status];

    if (startStatus) {
        measurement.start_status_name = startStatus.description;
        measurement.start_status_order = startStatus.order;
    }
    if (endStatus) {
        measurement.end_status_name = endStatus.description;
        measurement.end_status_order = endStatus.order;
    }
}

// Function to create measurement element
async function createMeasurementElement(measurement, parentElement, parentPhase) {
    const element = document.createElement("sla-measurement");
    element.id = measurement.id;
    element.dataset.code = measurement.code;
    element.dataset.version = measurement.version;
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

    element.style.gridArea = `m${measurement.incrementor}`;

    parentElement.shadowRoot.appendChild(element);

    return element;

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
    const activeRowNumber = parseInt(element.dataset.activeRow);

    if (measurementData.progress > 100 ) {
        if(measurementData.start_status_order >= activeRowNumber || measurementData.end_status_order <= activeRowNumber)
            element.classList.add("measurement-overdue-state");
            element.dataset.state = "overdue";
    } else if (measurementData.progress >= 80 && measurementData.progress <= 99) {
        element.dataset.state = "warning"
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
    if (element.dataset.parentPhase !== "runtime") return;
    const activeRowNumber = parseInt(element.dataset.activeRow) - 1;

    if (activeRowNumber < measurementData.start_status_order || activeRowNumber > measurementData.end_status_order) {
        element.dataset.state = "inactive";
        element.classList.add("measurement-inactive-state");
    }
    else {
        element.dataset.state = "active";
    }

    await updateProgressStyles(element, measurementData);

    //ToDo AW - Better names for start_status_name because they became numbers
}

crs.intent.sla_measurement = SlaMeasurementActions;