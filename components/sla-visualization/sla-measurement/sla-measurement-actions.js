import "./sla-measurement.js";
import {buildStandardElement} from "../sla-utils/sla-grid-utils.js";

/**
 * @class SlaMeasurementActions - A class that contains methods for the sla-measurement component
 *
 * @method perform - Executes the specified action step.
 * @method create_all - Creates the SLA measurement components.
 * @method update - Updates the SLA measurement with the provided data.
 * @method select_measurement - Selects the specified measurement.
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
    static async create_all(step, context, process, item) {
        const parentElement = await crs.dom.get_element(step.args.parent, context, process, item);
        const measurementData = await crs.process.getValue(step.args.data, context, process, item);
        const measurementDataStatuses = await crs.process.getValue(step.args.statuses, context, process, item);
        const parentPhase = await crs.process.getValue(step.args.parentPhase, context, process, item); // refactor for phase

        let incrementor = 0;
        const rowCount = (Object.keys(measurementDataStatuses).length) + 3;
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
            const measurementOverlay = await buildStandardElement(tagName,`m_${measurement.id}`,"measurement-overlay",null,`m${incrementor}`,`2 / ${rowCount}`);
            documentFragment.appendChild(measurementOverlay);

            const measurementFooterContainer = await buildStandardElement(tagName,`f_${measurement.id}`,"sla-footer-container",null,`f${incrementor}`);
            measurementFooterContainer.dataset.footerContent = measurement.description;
            measurementFooterContainer.title = measurement.description;
            documentFragment.appendChild(measurementFooterContainer);

            incrementor++;
        }
        parentElement.shadowRoot.appendChild(documentFragment);
    }

    /**
     * @method update - Updates the sla measurement with the measurement data
     * @param step {Object} - The step object in a process
     * @param context {Object} - The context object
     * @param process {Object} - The process object
     * @param item {Object} - The item object if in a loop
     * @returns {Promise<void>}
     */
    static async update(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const measurementData = await crs.process.getValue(step.args.measurementData, context, process, item);

        // Create trigger indicators
        await createTriggerIndicators(element, measurementData);

        if (element.dataset.parentPhase !== "runtime") return;

        // Update status based on parent phase
        await updateStatus(element, measurementData);

        // Update progress-related styles
        await updateProgressStyles(element, measurementData);
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
        const isSelected = measurementOverlay.getAttribute("aria-selected") === "true";

        measurementOverlay.setAttribute("aria-selected", isSelected ? "false" : "true");
        element.setAttribute("aria-selected", isSelected ? "false" : "true");

        measurementOverlay.style.opacity = isSelected ? "0" : "1";

        return element;
    }
}

/**
 * @method onSlaMeasurementLoading - Waits for the sla measurement to finish loading before executing the callback
 * @param slaMeasurementElement {HTMLElement} - The sla measurement element
 * @param callback {Function} - The callback function
 * @returns {Promise<unknown>}
 */
function onSlaMeasurementLoading(slaMeasurementElement, callback) {
    return new Promise(async resolve => {
        if (slaMeasurementElement.dataset.status === "ready") {
            resolve(await callback());
        } else {
            const listener = async () => {
                slaMeasurementElement.removeEventListener("measurement-loaded", listener);
                resolve(await callback());
            };
            slaMeasurementElement.addEventListener("measurement-loaded", listener);
        }
    });
}

/**
 * @method addStatusNames - Adds the status names to the measurement object
 * @param measurement {Object} - The measurement object
 * @param measurementDataStatuses {Object} - a status lookup table object
 * @returns {Promise<void>}
 */
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

/**
 * @method createMeasurementElement - Creates the measurement element
 * @param measurement {Object} - The measurement object
 * @param parentElement {HTMLElement} - The parent element of the measurement
 * @param parentPhase {String} - The parent phase of the measurement
 * @returns {Promise<HTMLElement>}
 */
async function createMeasurementElement(measurement, parentElement, parentPhase) {
    const [days, hours, minutes] = measurement.duration.split(":").slice(0, 3);
    const formattedDuration = `${days}:${hours}:${minutes}`;

    const element = document.createElement("sla-measurement");
    element.id = measurement.id;
    element.dataset.code = measurement.code;
    element.dataset.description = measurement.description;
    element.dataset.version = measurement.version;
    element.setAttribute("data-progress", measurement.progress);
    element.setAttribute("data-state", measurement.state);
    element.setAttribute("data-formatted-duration", formattedDuration);
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


/**
 * @method updateProgressStyles - Updates the progress-related styles
 * @param element {HTMLElement} - The sla-measurement element
 * @param measurementData {Object} - The measurement data object
 * @return {Promise<void>}
 */
async function updateProgressStyles(element, measurementData) {
    const progressBar = element.shadowRoot.querySelector("div.progress-bar");

    progressBar.style.transform = `scaleY(${Math.min(measurementData.progress, 100) / 100})`;
    element.dataset.progress = `${measurementData.progress}%`;

    const activeRowNumber = parseInt(element.dataset.activeRow);

    await setAlternativeMeasurementState(measurementData, activeRowNumber, element);
}

/**
 * @method setAlternativeMeasurementState - Sets the alternative measurement state to either warning or overdue
 * @param measurementData {Object} - The measurement data object
 * @param activeRowNumber {Number} - The active row number
 * @param element {HTMLElement} - The sla-measurement element
 * @returns {Promise<void>}
 */
async function setAlternativeMeasurementState(measurementData, activeRowNumber, element) {
    let measurementProgressState, measurementStateType;

    if (measurementData.progress > 100 ) {
        measurementProgressState = "measurement-overdue-state";
        measurementStateType = "overdue";
    }
    else if (measurementData.progress >= 80 && measurementData.progress <= 99) {
        measurementProgressState = "measurement-warning-state";
        measurementStateType = "warning";
    }

    if (measurementData.start_status_order <= activeRowNumber && measurementData.end_status_order >= activeRowNumber) {
        element.classList.add(measurementProgressState);
        element.dataset.state = measurementStateType;
    }
}

/**
 * @method calculateNextTrigger - Calculates the next trigger
 * @param measurementData {Object} - The measurement data object
 * @param currentProgress {Number} - The current progress
 * @return {String}
 */
async function calculateNextTrigger(measurementData, currentProgress) {
    for (const trigger of measurementData.triggers) {
        if (trigger.trigger > currentProgress) {
            return trigger.trigger;
        }
    }
    return "";
}

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
            triggerIndicator.dataset.triggerType = trigger.type !== null ? trigger.type : "";
            triggerIndicator.dataset.trigger = await calculateNextTrigger(measurementData, measurementData.progress);
            triggerIndicator.classList.add("measurement-trigger-indicator");
            triggerIndicator.style.bottom = `${trigger.trigger}%`;
            triggerIndicator.dataset.triggerProgress =`${trigger.trigger}%`;
            trigger.trigger === 0 ? triggerIndicator.style.opacity = "0" : triggerIndicator.style.opacity = "1";
            element.shadowRoot.appendChild(triggerIndicator);
        }
    }
}

/**
 * @method updateStatus - Updates the status based on the parent phase
 * @param element {HTMLElement} - The sla-measurement element
 * @param measurementData {Object} - The measurement data object
 * @return {Promise<void>}
 */
async function updateStatus(element, measurementData) {
    const activeRowNumber = parseInt(element.dataset.activeRow);

    if (activeRowNumber < measurementData.start_status_order || activeRowNumber > measurementData.end_status_order) {
        element.dataset.state = "inactive";
        element.classList.add("measurement-inactive-state");
    }
    else {
        element.dataset.state = "active";
    }
}

crs.intent.sla_measurement = SlaMeasurementActions;