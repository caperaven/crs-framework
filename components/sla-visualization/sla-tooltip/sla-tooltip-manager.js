import {buildStandardElement} from "../sla-utils/sla-grid-utils.js";

/**
 * @class SlaTooltipManager - A class that manages the tooltip for the sla visualization component's measurements
 *
 * @method constructor - Initializes the tooltip manager.
 * @method dispose - Disposes the tooltip manager.
 * @method #initialize - Initializes the tooltip.
 * @method #toggleTooltip - Shows the tooltip based on the measurement element.
 * @method #setTooltipVisibleState - Sets the tooltip visible state.
 * @method #createMeasurementTooltip - Creates the measurement tooltip.
 * @method #inflateTriggers - Inflates the triggers template and appends the fragment to the tooltip after the first child.
 * @method #getMeasurementData - Gets the measurement data and returns it as an object.
 * @method #buildTriggerLookup - Builds the trigger lookup.
 * @method #setTooltipPosition - Sets the tooltip position.
 * @method #updateMeasurementTooltipContent - Updates the this.#tooltip content based on the measurementData.
 */
export class SlaTooltipManager {
    #measurementHoverHandler = this.#toggleTooltip.bind(this);
    #tooltip;
    #phase;
    #templateId= "setup-tooltip";
    #triggerContainer;

    constructor(visualization) {
        this.#phase = visualization.dataset.phase;
        visualization.addEventListener("measurement-hovered", this.#measurementHoverHandler);
        this.#initialize();
    }

    async dispose(visualization) {
        visualization.removeEventListener("measurement-hovered", this.#measurementHoverHandler);
        await crs.call("styles", "unload_file", {id: `${this.#templateId}-sla-tooltip-styles`});
        await crsbinding.inflationManager.unregister(`${this.#templateId}-sla-tooltip-template`);
        if (this.#phase === "runtime") {
            // This is to prevent the scenario where both the setup and runtime visualisations are visible and the setup closes
            // which fires the dispose function, in this case we do not want to unregister the triggers-template prematurely.
            await crsbinding.inflationManager.unregister("triggers-template");
        }
        this.#measurementHoverHandler = null
        this.#phase = null;
        this.#templateId = null;
        this.#triggerContainer = null;
        if (this.#tooltip == null) return;
        this.#tooltip?.remove();
        this.#tooltip = null;
    }

    /**
     * @method #initialize - Initializes the tooltip.
     * @returns {Promise<void>}
     */
    async #initialize() {
        let dynamicPath = "-setup.html";

        if (this.#phase === "runtime") {
            dynamicPath = "-runtime.html";
            this.#templateId = "runtime-tooltip";

            //registers the triggers template if the phase is runtime.
            await this.#registerTemplate("-triggers.html", "triggers-template");
        }

        await this.#registerTemplate(dynamicPath,`${this.#templateId}-sla-tooltip-template`);

        // here we are going to add the link to the document head to load the css file
        await crs.call("styles", "load_file", {id: `${this.#templateId}-sla-tooltip-styles`, file: import.meta.url.replace("-manager.js", ".css")});
    }

    async #registerTemplate(pathName, templateId) {
        const templateHtmlFile = await fetch(import.meta.url.replace("-manager.js", pathName)).then(result => result.text());
        const templateElement = await buildStandardElement("template", templateId);
        templateElement.innerHTML = templateHtmlFile;
        await crsbinding.inflationManager.register(templateId, templateElement);
    }

    /**
     * @method #toggleTooltip - shows the tooltip based on the measurement element.
     * @param event {CustomEvent} - the custom event object
     * @returns {Promise<void>}
     */
    async #toggleTooltip(event) {
        const measurement = event.detail.measurement;

        if (measurement != null) {
            const triggerArray = await this.#buildTriggersArray(measurement);

            const measurementId = measurement?.id;
            const measurementData = await this.#getMeasurementData(measurement,triggerArray.length);
            const tooltipId = `m-${measurementId}`;

            if (this.#tooltip == null) {
                await this.#createMeasurementTooltip(tooltipId,measurementData);
                this.#triggerContainer = this.#tooltip.querySelector("[data-id='trigger-data']");
            } else {
                await this.#updateMeasurementTooltipContent(tooltipId,measurementData);
            }

            await this.#inflateTriggersContainerContent(measurementId,triggerArray);
            await this.#setTooltipPosition(measurement);
            return;
        }

        await this.#setTooltipVisibleState(true);
    }

    /**
     * @method #setTooltipVisibleState - Sets the tooltip visible state.
     * @param isVisible {Boolean} - boolean value to set the tooltip visible state.
     * @returns {Promise<void>}
     */
    async #setTooltipVisibleState(isVisible) {
        if (this.#tooltip == null) return;

        if (isVisible == false ) {
            this.#tooltip.removeAttribute("hidden");
            return;
        }
        this.#tooltip.setAttribute("hidden", isVisible);
    }

    /**
     * @method #createMeasurementTooltip - Creates the measurement tooltip.
     * @param id {String} - the measurement id
     * @param measurementData {Object} - the measurement data
     * @returns {Promise<void>}
     */
    async #createMeasurementTooltip(id, measurementData) {
        const tooltipFragment = await crsbinding.inflationManager.get(`${this.#templateId}-sla-tooltip-template`, measurementData);
        this.#tooltip = tooltipFragment.children[0];
        this.#tooltip.setAttribute("id", id);
        document.body.appendChild(tooltipFragment);
    }

    /**
     * @method #inflateTriggersContainerContent - Inflates the triggers template and appends the fragment to the tooltip after the first child.
     * @returns {Promise<void>}
     */
    async #inflateTriggersContainerContent(measurementId, triggerArray) {
        //return if the phase is not runtime, this is because the trigger template is not required on setup
        if (this.#phase !== "runtime") return;

        // clears the trigger container innerHTML
        await this.#resetTriggersContainer();
        const fragment = await crsbinding.inflationManager.get("triggers-template", triggerArray);
        this.#triggerContainer.setAttribute("id",`m-${measurementId}`);
        this.#triggerContainer.appendChild(fragment);
    }

    /**
     * @method #resetTriggers - Resets the triggers containers innerHTML.
     * @returns {Promise<void>}
     */
    async #resetTriggersContainer() {
        if(this.#triggerContainer.innerHTML === "") return;

        this.#triggerContainer.innerHTML = "";
    }

    /**
     * @method #getMeasurementData - Gets the measurement data and returns it as an object.
     * @param measurement {Element} - the measurement element,
     * @param numberOfTriggers {Number} - the number of triggers
     * @returns {Promise<object>}
     */
    async #getMeasurementData(measurement,numberOfTriggers) {
        const measurementTriggerPercentage = measurement.dataset.nextTriggerPercentage ?? "";
        const measurementData = {
            description: measurement.dataset.description,
            duration: measurement.dataset.duration,
            progress: measurement.dataset.progress,
            numberOfTriggers: numberOfTriggers,
            startStatus: measurement.getAttribute("data-start-status-name", ""),
            endStatus: measurement.getAttribute("data-end-status-name", ""),
            startLabel: globalThis.translations.sla.labels.startLabel,
            endLabel: globalThis.translations.sla.labels.endLabel,
            durationLabel: globalThis.translations.sla.labels.durationLabel,
            progressLabel: globalThis.translations.sla.labels.progressLabel,
            triggerLabel: globalThis.translations.sla.labels.triggerLabel,
            slaMeasureLabel: globalThis.translations.sla.labels.slaMeasurementLabel,
            nextTriggerLabel: globalThis.translations.sla.labels.nextTriggerLabel,
            nextTriggerDescriptionLabel: globalThis.translations.sla.labels.nextTriggerDescriptionLabel,
            nextTrigger: measurementTriggerPercentage === "" ? measurementTriggerPercentage : `${measurementTriggerPercentage}%`,
            nextTriggerDescription: measurement.dataset.nextTriggerDescription ?? ""
        }

        return measurementData;
    }

    /**
     * @method #buildTriggersArray - Builds the triggers array.
     * @returns {Promise<array>}
     */
    async #buildTriggersArray (measurement) {
        const triggerElements = measurement.shadowRoot.querySelectorAll(".measurement-trigger-indicator");

        const measurementTriggersArray = [];

        for (const triggerElement of triggerElements) {
            const triggerObject =  {
                triggerProgress: triggerElement.dataset.triggerProgress,
                triggerDescription: `${triggerElement.dataset.triggerType} :`
            }
            measurementTriggersArray.push(triggerObject);
        }

        return measurementTriggersArray;
    }

    /**
     * @method #setTooltipPosition - Sets the tooltip position.
     * @param measurement {Element} - the measurement element
     * @returns {Promise<void>}
     */
    async #setTooltipPosition(measurement) {
        const {right} = measurement.getBoundingClientRect();

        await this.#setTooltipVisibleState(false);

        const tooltipPosition = (globalThis.innerWidth - right) < 240 ? "left" : "right";

        await crs.call("fixed_layout", "set", {
            element: this.#tooltip,
            target: measurement,
            at: tooltipPosition,
            anchor: "top",
            margin: 5
        });
    }

    /**
     * @method #updateMeasurementTooltipContent - Updates the this.#tooltip content based on the measurementData.
     * @param id {String} - the measurement id
     * @param measurementData {Object} - the measurement data
     * @returns {Promise<void>}
     */
    async #updateMeasurementTooltipContent(id, measurementData) {
        await crsbinding.inflationManager.inflate(`${this.#templateId}-sla-tooltip-template`,this.#tooltip, measurementData);
        this.#tooltip.setAttribute("id", id);
    }
}