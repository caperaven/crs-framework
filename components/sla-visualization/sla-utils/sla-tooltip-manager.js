export class SlaTooltipManager {
    #parentVisualization;
    #measurementHoverHandler = this.#initialize.bind(this);
    #popup;

    constructor(visualization) {
        this.#parentVisualization = visualization;
        this.#parentVisualization.addEventListener("measurement-hovered", this.#measurementHoverHandler);
    }

    dispose() {
        this.#parentVisualization.removeEventListener("measurement-hovered", this.#measurementHoverHandler);
        this.#popup = null;
        this.#parentVisualization = null;
        this.#measurementHoverHandler = null
    }

    /**
     * @method #initialize - Initializes the tooltip/popup based on the measurement element.
     * @param event {CustomEvent} - the custom event object
     * @returns {Promise<void>}
     */
    async #initialize(event) {
        const measurement = event.detail.measurement;

        if (measurement != null) {
            const measurementData = await this.#getMeasurementData(measurement);

            if (this.#popup == null) {
                await this.#createMeasurementPopup(measurement, measurementData);
            }
            else {
                await this.#updateMeasurementPopupContent(measurement, measurementData);
            }

            await this.#setPopupPosition(measurement);
            return;
        }

        await this.#setPopupVisibleState(false);
    }

    /**
     * @method #setPopupVisibleState - Sets the tooltip visible state.
     * @param state {Boolean} - boolean value to set the tooltip visible state
     * @returns {Promise<void>}
     */
    async #setPopupVisibleState(state) {
        if (this.#popup == null) return;

        this.#popup.dataset.visible = state;
    }

    /**
     * @method #createMeasurementPopup - Creates the measurement popup.
     * @param measurement {Element} - the measurement element
     * @returns {Promise<void>}
     */
    async #createMeasurementPopup(measurement, measurementData) {
        this.#popup = await crs.call("sla_measurement", "inflate_measurement_info_template", {
            element: measurement,
            type: "mouseenter",
            measurement_data: measurementData
        });
    }

    /**
     * @method #getMeasurementData - Gets the measurement data and returns it as an object.
     * @param measurement {Element} - the measurement element
     * @returns {Promise<{duration: string, code: string, NumOfTriggers: number, startStatus: *, progress: string, endStatus: *}>}
     */
    async #getMeasurementData(measurement) {
        const measurementData = {
            code: measurement.dataset.code,
            startStatus: measurement.getAttribute("data-start-status-name", ""),
            endStatus: measurement.getAttribute("data-end-status-name", ""),
            duration: measurement.dataset.duration,
            progress: measurement.dataset.progress,
            NumOfTriggers: measurement.shadowRoot.querySelectorAll(".measurement-trigger-indicator").length
        };

        const measurementTriggerIndicator = measurement.shadowRoot.querySelector(".measurement-trigger-indicator");

        if (measurementTriggerIndicator !== null) {
            measurementData.nextTrigger = measurementTriggerIndicator.dataset?.trigger;
            measurementData.triggerType = measurementTriggerIndicator.dataset?.triggerType;
        }

        return measurementData;
    }

    /**
     * @method #setPopupPosition - Sets the popup position.
     * @param measurement {Element} - the measurement element
     * @param point {Object} - the point object consist of x and y coordinates
     * @returns {Promise<void>}
     */
    async #setPopupPosition(measurement, point = null) {
        await crs.call("fixed_layout", "set", {
            element: this.#popup,
            target: measurement,
            at: "right",
            anchor: "top",
            margin: 1
        });
        await this.#setPopupVisibleState(true);
    }

    async #updateMeasurementPopupContent(measurement, measurementData) {
        const measurementId = `m-${measurement.id}`;

        if (this.#popup.dataset.id === measurementId) return;

        const spanElementsList = this.#popup.querySelectorAll("span");
        const spanIdMapping = {
            "measurement-start": "startStatus",
            "measurement-end": "endStatus",
            "measurement-duration": "duration",
            "measurement-progress": "progress",
            "next-trigger": "nextTrigger",
            "trigger-description": "triggerType",
        }

        for (const span of spanElementsList) {
            const propertyKey = spanIdMapping[span.id];
            span.textContent = measurementData[propertyKey];
        }

        this.#popup.firstElementChild.textContent = measurementData.code;
        this.#popup.dataset.id = measurementId;
    }
}