import {buildStandardElement} from "../sla-utils/sla-grid-utils.js";

export class SlaTooltipManager {
    #measurementHoverHandler = this.#toggle.bind(this);
    #popup;
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

        if (this.#popup == null) return;
        this.#popup?.remove();
        this.#popup = null;
    }

    /**
     * @method #initialize - Initializes the tooltip/popup.
     * @returns {Promise<void>}
     */
    async #initialize() {
        let replacePath = "-setup.html";

        if (this.#phase === "runtime") {
            replacePath = "-runtime.html";
            this.#templateId = "runtime-popup";
        }

        const popupHtmlFile = await fetch(import.meta.url.replace("-manager.js", replacePath)).then(result => result.text());

        const popupTemplate = await buildStandardElement("template", `${this.#phase}-sla-popup-template`);
        popupTemplate.innerHTML = popupHtmlFile;

        // here we are going to add the link to the document head to load the css file
        await crs.call("styles", "load_file", {id: "sla-popup-styles", file: import.meta.url.replace("-manager.js", ".css")});

        // here we are going to register the template with the inflation manager
        await crsbinding.inflationManager.register(this.#templateId, popupTemplate);
    }

    /**
     * @method #show - shows the tooltip/popup based on the measurement element.
     * @param event {CustomEvent} - the custom event object
     * @returns {Promise<void>}
     */
    async #toggle(event) {
        const measurement = event.detail.measurement;

        if (measurement != null) {
            const measurementData = await this.#getMeasurementData(measurement);
            const popupId = `m-${measurement.id}`;

            if (this.#popup == null) {
                await this.#createMeasurementPopup(popupId,measurementData);
            }else {
                await this.#updateMeasurementPopupContent(popupId,measurementData);
            }

            await this.#setPopupPosition(measurement);
            return;
        }

        await this.#setPopupVisibleState(true);
    }

    /**
     * @method #setPopupVisibleState - Sets the tooltip visible state.
     * @param state {Boolean} - boolean value to set the tooltip visible state
     * @returns {Promise<void>}
     */
    async #setPopupVisibleState(state) {
        if (this.#popup == null) return;

        if (state == false ) {
            this.#popup.removeAttribute("hidden");
            return;
        }
        this.#popup.setAttribute("hidden", state);
    }

    /**
     * @method #createMeasurementPopup - Creates the measurement popup.
     * @param measurement {Element} - the measurement element
     * @returns {Promise<void>}
     */
    async #createMeasurementPopup(id,measurementData) {
        const popupFragment = await crsbinding.inflationManager.get(this.#templateId, measurementData);
        this.#popup = popupFragment.children[0];
        this.#popup.setAttribute("id", id);
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
     * @method #setPopupPosition - Sets the popup position.
     * @param measurement {Element} - the measurement element
     * @returns {Promise<void>}
     */
    async #setPopupPosition(measurement) {
        await crs.call("fixed_layout", "set", {
            element: this.#popup,
            target: measurement,
            at: "right",
            anchor: "top",
            margin: 1
        });
        await this.#setPopupVisibleState(false);
    }

    /**
     * @method #updateMeasurementPopupContent - Updates the this.#popup content based on the measurementData.
     * @param measurement
     * @param measurementData
     * @returns {Promise<void>}
     */
    async #updateMeasurementPopupContent(id, measurementData) {
        if (this.#popup.id === id) return;

        this.#popup.setAttribute("id", id);
        await crsbinding.inflationManager.inflate(this.#templateId,this.#popup, measurementData);
    }
}