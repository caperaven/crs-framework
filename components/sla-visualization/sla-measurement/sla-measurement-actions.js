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
        const parentPhase = await crs.process.getValue(step.args.parentPhase, context, process, item); // refactor for phase

        for (const measurement of measurementData) {
            const element = document.createElement("sla-measurement");
            element.id = measurement.id;
            element.dataset.code = measurement.code;
            element.setAttribute("data-progress", measurement.progress);
            element.setAttribute("data-state", measurement.state); // Ask Rabie about this
            element.setAttribute("data-duration", measurement.duration);
            element.setAttribute("data-start-status", measurement.start_status);
            element.setAttribute("data-end-status", measurement.end_status);
            element.setAttribute("data-parent-phase", parentPhase); // refactor for phase
            element.dataset.activeRow = parentElement.dataset.activeRow;

            element.style.gridArea = `m_${measurement.id}`;

            parentElement.shadowRoot.appendChild(element);

            const measurementFooterContainer = document.createElement("div");
            measurementFooterContainer.classList.add("sla-footer-container");
            measurementFooterContainer.id = `f_${measurement.id}`;
            measurementFooterContainer.textContent = `${measurement.code}`
            measurementFooterContainer.style.gridArea = `f_${measurement.id}`;
            parentElement.shadowRoot.appendChild(measurementFooterContainer);
        }

        for (const measurement of parentElement.shadowRoot.querySelectorAll("sla-measurement")) {
            const measurementId = measurement.id;
            const correspondingMeasurementData = measurementData.find(measurement => measurement.id === measurementId);

            if (correspondingMeasurementData) {
                const triggers = correspondingMeasurementData.triggers || [];

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

    static async update(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        // const progress = await crs.process.getValue(step.args.progress || 0, context, process, item);
        // const triggers = await crs.process.getValue(step.args.triggers || 0, context, process, item);
        const measurementData = await crs.process.getValue(step.args.measurementData, context, process, item);

        const progressBar = element.shadowRoot.querySelector("div.progress-bar");
        progressBar.style.height = `${measurementData.progress <= 100 ? measurementData.progress - 7 : 93}%`;
        element.dataset.progress = `${measurementData.progress}%`;


        // take the progress value and set it to an integer
        // and then add the class to the element based on the progress value
        if (parseInt(measurementData.progress) > 100) {
            element.classList.add("measurement-overdue-state");
        } else if (parseInt(measurementData.progress) >= 80 && parseInt(measurementData.progress) <= 99) {
            element.classList.add("measurement-warning-state");
        }

        // If there are triggers, create them;
        if (measurementData.triggers?.length > 0) {
            for(const trigger of measurementData.triggers) {
                const triggerIndicator = document.createElement("div");
                triggerIndicator.id = `trigger_${trigger.id}`;
                triggerIndicator.dataset.trigger = `${trigger.trigger}%`;
                triggerIndicator.classList.add("measurement-trigger-indicator");
                triggerIndicator.style.bottom = `${trigger.trigger}%`;
                trigger.trigger === 0 ? triggerIndicator.style.opacity = "0" : triggerIndicator.style.opacity = "1";
                element.shadowRoot.appendChild(triggerIndicator);
            }
        }

        // check the end and start status. If the status is equal to or more than the start, it gets data-active.
        // else if the status is more than the end status, or less than the start status, it gets data-inactive.
        if (element.dataset.parentPhase === "runtime"){ // refactor for phase
            if (element.dataset.activeRow < measurementData.start_status || element.dataset.activeRow > measurementData.end_status) {
                element.dataset.state = "inactive";
            }
        }

    }

    static async display_measurement_info(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const type = await crs.process.getValue(step.args.type, context, process, item);
        const measurementData = {
            code: element.dataset.code,
            startStatus: element.getAttribute("data-start-status", ""),
            endStatus: element.getAttribute("data-end-status", ""),
            duration: element.dataset.duration,
            progress: element.dataset.progress
        }


            const measurementInfoTemplate = element.shadowRoot.querySelector("template.measurement-info-template");
            const measurementInfo = measurementInfoTemplate.content.cloneNode(true);
            // measurementInfo.firstElementChild.style.display = type === "mouseenter" ? "flex" : "none";

            await crs.binding.staticInflationManager.inflateElement(measurementInfo.firstElementChild, measurementData);
            element.shadowRoot.appendChild(measurementInfo);

            const measurementInfoElement = element.shadowRoot.querySelector(".measurement-info");
            measurementInfoElement.style.display = type === "mouseenter" ? "flex" : "none";




        if(element.dataset.parentPhase === "setup"){
            element.style.background = type === "mouseenter" ? "#075E96" : "var(--blue)";
        }
        // positionTooltip(measurementInfoElement, element);

    }

    static async select_measurement(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const measurementParent = await crs.dom.get_element(step.args.measurementParent, context, process, item);
        const measurementOverlay = measurementParent.shadowRoot.querySelector(`#m_${element.id}.measurement-overlay`);



        // toggle selected class if selected is true or false on measurementOverlay
        // Check if data-selected attribute exists
        const isSelected = measurementOverlay.getAttribute("data-selected") === "true";

        // Toggle the value of data-selected attribute
        measurementOverlay.setAttribute("data-selected", isSelected ? "false" : "true");
        element.dataset.selected = isSelected ? "false" : "true";


        // Set opacity based on the selected state
        measurementOverlay.style.opacity = isSelected ? "0" : "1";

        return element;

    }

    static async remove_measurement(step, context, process, item) {
        const parentElement = await crs.dom.get_element(step.args.element, context, process, item);
        const selectedMeasurements = parentElement.shadowRoot.querySelector("sla-layer").shadowRoot.querySelectorAll("sla-measurement[data-selected='true']");
        const measurementOverlay = parentElement.shadowRoot.querySelector("sla-layer").shadowRoot.querySelectorAll(`[data-selected='true']`)

        // if (selectedMeasurements) {
        //     selectedMeasurements.dataset.selected = "false";
        //     measurementOverlay.dataset.selected = "false";
        //     measurementOverlay.style.opacity = "0";
        //     selectedMeasurements.remove();
        // }
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

function positionTooltip(tooltip, targetElement) {
    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewPortRect = targetElement.getRootNode().host.getBoundingClientRect();
    const viewportWidth = targetElement.getRootNode().host.clientWidth;
    const viewportHeight = targetElement.getRootNode().host.clientHeight;


    // take the width of the viewport and position the tooltip based on the width of the viewport
    // so it doesn't go off the screen and is always visible inside the viewport
    tooltip.style.left = `${viewportWidth - targetRect.right < tooltipRect.width ? targetRect.left - tooltipRect.width : targetRect.right}px`;

}



crs.intent.sla_measurement = SlaMeasurementActions;