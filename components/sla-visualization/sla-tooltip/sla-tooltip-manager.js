import {buildStandardElement} from "../sla-utils/sla-grid-utils.js";

/**
 * @class SlaTooltipManager - A class that manages the tooltip for the sla visualization component's measurements
 * @method dispose - Disposes the tooltip manager
 * @method #initialize - Initializes the tooltip/popup
 * @method #toggleTooltip - Shows the tooltip based on the measurement element
 * @method #setTooltipVisibleState - Sets the tooltip visible state
 * @method #createMeasurementTooltip - Creates the measurement tooltip
 * @method #getMeasurementData - Gets the measurement data and returns it as an object
 * @method #setTooltipPosition - Sets the popup position
 * @method #updateMeasurementTooltipContent - Updates the this.#tooltip content based on the measurementData
 */
export class SlaTooltipManager {
    #measurementHoverHandler = this.#toggleTooltip.bind(this);
    #tooltip;
    #phase;
    #templateId= "setup-popup";

    constructor(visualization) {
        this.#phase = visualization.dataset.phase;
        visualization.addEventListener("measurement-hovered", this.#measurementHoverHandler);
        this.#initialize();
    }

    async dispose(visualization) {
        visualization.removeEventListener("measurement-hovered", this.#measurementHoverHandler);
        await crs.call("styles", "unload_file", {id: "sla-popup-styles"});
        await crsbinding.inflationManager.unregister(this.#templateId);
        this.#measurementHoverHandler = null
        this.#phase = null;
        this.#templateId = null;

        if (this.#tooltip == null) return;
        this.#tooltip?.remove();
        this.#tooltip = null;
    }

    /**
     * @method #initialize - Initializes the tooltip/popup.
     * @returns {Promise<void>}
     */
    async #initialize() {
        let dynamicPath = "-setup.html";

        if (this.#phase === "runtime") {
            dynamicPath = "-runtime.html";
            this.#templateId = "runtime-popup";
        }

        const popupHtmlFile = await fetch(import.meta.url.replace("-manager.js", dynamicPath)).then(result => result.text());

        const popupTemplate = await buildStandardElement("template", `${this.#phase}-sla-popup-template`);
        popupTemplate.innerHTML = popupHtmlFile;

        // here we are going to add the link to the document head to load the css file
        await crs.call("styles", "load_file", {id: "sla-popup-styles", file: import.meta.url.replace("-manager.js", ".css")});

        // here we are going to register the template with the inflation manager
        await crsbinding.inflationManager.register(this.#templateId, popupTemplate);
    }

    /**
     * @method #toggleTooltip - shows the tooltip based on the measurement element.
     * @param event {CustomEvent} - the custom event object
     * @returns {Promise<void>}
     */
    async #toggleTooltip(event) {
        const measurement = event.detail.measurement;

        if (measurement != null) {
            const measurementData = await this.#getMeasurementData(measurement);
            const popupId = `m-${measurement.id}`;

            if (this.#tooltip == null) {
                await this.#createMeasurementTooltip(popupId,measurementData);
            }else {
                await this.#updateMeasurementTooltipContent(popupId,measurementData);
            }

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
        const popupFragment = await crsbinding.inflationManager.get(this.#templateId, measurementData);
        this.#tooltip = popupFragment.children[0];
        this.#tooltip.setAttribute("id", id);
        document.body.appendChild(popupFragment);
    }

    /**
     * @method #getMeasurementData - Gets the measurement data and returns it as an object.
     * @param measurement {Element} - the measurement element
     * @returns {Promise<{duration: string, code: string, NumOfTriggers: number, startStatus: *, progress: string, endStatus: *}>}
     */
    async #getMeasurementData(measurement) {
        const measurementData = {
            description: measurement.dataset.description,
            duration: measurement.dataset.duration,
            progress: measurement.dataset.progress,
            numberOfTriggers: measurement.shadowRoot.querySelectorAll(".measurement-trigger-indicator").length,
            startStatus: measurement.getAttribute("data-start-status-name", ""),
            endStatus: measurement.getAttribute("data-end-status-name", ""),
            trigger: "",
            triggerDescription: "",
            startLabel: globalThis.translations.sla.labels.startLabel,
            endLabel: globalThis.translations.sla.labels.endLabel,
            durationLabel: globalThis.translations.sla.labels.durationLabel,
            progressLabel: globalThis.translations.sla.labels.progressLabel,
            triggerLabel: globalThis.translations.sla.labels.triggerLabel,
            triggerDescriptionLabel: globalThis.translations.sla.labels.triggerDescriptionLabel,
            numberOfTriggersLabel: globalThis.translations.sla.labels.numberOfTriggersLabel,
        };

        const measurementTriggerIndicator = measurement.shadowRoot.querySelector(".measurement-trigger-indicator");

        if (measurementTriggerIndicator !== null) {
            measurementData.trigger = measurementTriggerIndicator.dataset?.trigger;
            measurementData.triggerDescription = measurementTriggerIndicator.dataset?.triggerType;
        }

        return measurementData;
    }

    /**
     * @method #setTooltipPosition - Sets the popup position.
     * @param measurement {Element} - the measurement element
     * @returns {Promise<void>}
     */
    async #setTooltipPosition(measurement) {
        const {right} = measurement.getBoundingClientRect();

        const tooltipPosition = (window.innerWidth - right) < 240 ? "left" : "right";

        await crs.call("fixed_layout", "set", {
            element: this.#tooltip,
            target: measurement,
            at: tooltipPosition,
            anchor: "top",
            margin: 1
        });
        await this.#setTooltipVisibleState(false);
    }

    /**
     * @method #updateMeasurementTooltipContent - Updates the this.#tooltip content based on the measurementData.
     * @param id {String} - the measurement id
     * @param measurementData {Object} - the measurement data
     * @returns {Promise<void>}
     */
    async #updateMeasurementTooltipContent(id, measurementData) {
        if (this.#tooltip.id === id) return;

        this.#tooltip.setAttribute("id", id);
        await crsbinding.inflationManager.inflate(this.#templateId,this.#tooltip, measurementData);
    }
}