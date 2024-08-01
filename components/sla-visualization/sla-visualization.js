import {create_sla_grid} from "./sla-utils/sla-grid-utils.js"
import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";
import "../../packages/crs-process-api/action-systems/no-content-actions.js";
import {SlaTooltipManager} from "./sla-tooltip/sla-tooltip-manager.js";

/**
 * @class SlaVisualization - This component is responsible for rendering the SLA visualization.
 *
 * @method connectedCallback - Called when the element is connected to the document.
 * @method disconnectedCallback - Called when the element is disconnected from the document.
 * @method #click - Handles the click event on the SLA visualization.
 * @method #contextMenu - Handles the context menu event on the SLA visualization.
 * @method #scaleGridVisualization - Handles the scaling of the grid visualization.
 * @method initialize - Initializes the SLA visualization component.
 * @method render - Renders the SLA visualization component.
 * @method #selectionChanged - Handles the selection change event on the SLA visualization.
 * @method #hookDataManager - Hooks into the data manager to listen for changes.
 * @method #dataManagerChanged - Handles the data manager change event.
 * @method #refresh - Refreshes the SLA visualization component.
 * @method enable - Enables the SLA visualization component.
 * @method disable - Disables the SLA visualization component.
 * @method #updateSlaLegend - Updates the SLA legend with the relevant counts for each measurement state.
 */
export class SlaVisualization extends HTMLElement {
    #dataManagerChangedHandler = this.#dataManagerChanged.bind(this);
    #changeEventMap = {
        [CHANGE_TYPES.refresh]: this.#refresh
    };

    #currentStatusIndex;
    #statusLookupTable;
    #orderedStatuses;
    #selectedMeasurement;
    #currentStatus;
    #container;
    #selectionChangedHandler = this.#selectionChanged.bind(this);
    #slaTooltipManager;
    #clickHandler = this.#click.bind(this);
    #contextMenuHandler = this.#contextMenu.bind(this);
    #currentScale = 1;
    #scaleHandler = this.#scaleGridVisualization.bind(this);
    #statusLabelContainer;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    /**
     * This is used externally for crud operations where we need to get the selected measurements.
     */
    get selectedMeasurements() {
        return this.#selectedMeasurement;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = html;
        this.#container = this.shadowRoot.querySelector("#sla-grid-container");
        this.#statusLabelContainer = this.shadowRoot.querySelector("#grid-label-container");
        this.addEventListener("measurement-selected", this.#selectionChangedHandler);
        // ToDo: This is for the context menu on the measurements. We will re-implement this in the future for V2
        // this.addEventListener("contextmenu", this.#contextMenuHandler);
        this.addEventListener("click", this.#clickHandler);
        this.addEventListener("wheel", this.#scaleHandler);
        await crs.call("component", "notify_ready", { element: this });
    }

    async disconnectedCallback() {
        // ToDo: This is for the context menu on the measurements. We will re-implement this in the future for V2
        // this.removeEventListener("contextmenu", this.#contextMenuHandler);
        this.removeEventListener("click", this.#clickHandler);
        this.removeEventListener("wheel", this.#scaleHandler);
        this.#clickHandler = null;
        this.#scaleHandler = null;
        this.#contextMenuHandler = null;
        await crs.call("data_manager", "remove_change", {manager: this.dataset.manager, callback: this.#dataManagerChangedHandler});
        this.#dataManagerChangedHandler = null;
        this.#changeEventMap = null;
        this.#statusLookupTable = null;
        this.#currentStatus = null;
        this.#container = null;
        this.removeEventListener("measurement-selected", this.#selectionChangedHandler);
        this.#selectionChangedHandler = null;
        this.#selectedMeasurement = null;
        this.#currentScale = null;
        this.#statusLabelContainer = null;

        if (this.#slaTooltipManager == null) return;

        await this.#slaTooltipManager.dispose(this);
        this.#slaTooltipManager = null;
    }

    /**
     * @method #click - Handles the click event on the SLA visualization. Mostly used for selecting measurements.
     * @param event {MouseEvent} - the mouse event object
     * @returns {Promise<void>}
     */
    async #click(event) {
        const measurement = event.composedPath()[0];

        if (this.dataset.phase !== "setup" || measurement.tagName.toLowerCase() !== "sla-measurement") return;

        const parentElement = measurement.getRootNode().host;

        await crs.call("sla_measurement", "select_measurement", {element: measurement, measurementParent: parentElement});

        const selectedElements = parentElement.shadowRoot.querySelectorAll("sla-measurement[aria-selected='true']")

        const selectedMeasurements = [];
        for (const measurement of selectedElements) {
            selectedMeasurements.push({
                id: parseInt(measurement.id),
                version: parseInt(measurement.dataset.version) || 1
            });
        }

        await this.#selectionChanged(selectedMeasurements)
    }

    /**
     * @method #contextMenu - Handles the context menu event on the SLA visualization. Mostly used for showing the context menu on measurements.
     * @param event {MouseEvent} - the mouse event object
     * @returns {Promise<void>}
     */
    async #contextMenu(event) {
        event.preventDefault();
        const measurement = event.composedPath()[0];

        if (this.dataset.phase !== "setup" || measurement.tagName.toLowerCase() !== "sla-measurement") return;

        const parentElement = event.composedPath()[0].getRootNode().host

        await crs.call("context_menu", "show", {
            point: {x: event.clientX, y: event.clientY},
            icon_font_family: "crsfrw",
            filtering: false,
            options: [
                { id: "edit-measurement", title: "Edit", tags: "edit", icon: "edit", action: "edit", attributes: { "aria-hidden.if": "status == 'b'" } },
                { id: "delete-measurement", title: "Delete", tags: "delete", icon: "delete", icon_color: "var(--red)", type: "sla_measurement", action: "remove_measurement", args: { element: parentElement} }
            ]
        });
    }

    /**
     * @method #scaleGridVisualization - Handles the scaling of the grid visualization.
     * @param event {WheelEvent} - the wheel event object
     * @returns {Promise<void>}
     */
    async #scaleGridVisualization(event) {
        if (event.ctrlKey === false) return;

        event.preventDefault();

        const zoomScale =  event.deltaY < 0 ? 0.1 : -0.1;

        if (zoomScale > 0 && this.#currentScale === 1 || zoomScale < 0 && this.#currentScale === 0.1) return;

        this.#currentScale += zoomScale;

        // Round the scale value to one decimal place
        this.#currentScale = Math.round(this.#currentScale * 10) / 10;

        // We want to set the translate-x depending on the scale. 0.1 = 200 and 1 = 0
        // Inverse scale
        const invertScale = 1 - this.#currentScale;
        const translateX = (invertScale * 200) * -1;

        this.style.setProperty('--scale', this.#currentScale);
        this.style.setProperty('--translate-x', `${translateX}px`);
    }

    /**
     * @method initialize - Initializes the SLA visualization component. We create a status lookup table and set the current status.
     * @param statuses {object} - the statuses that are used in the SLA visualization
     * @param currentStatus {number} - the current status of the SLA visualization
     * @returns {Promise<void>}
     */
    async initialize(statuses, currentStatus) {
        this.#statusLookupTable = {};
        this.#currentStatus = currentStatus
        let index = 0;
        for (const status of statuses) {
            if(status.id === this.#currentStatus){
                this.#currentStatusIndex = index;
            }
            status.order = index++;
            this.#statusLookupTable[status.id] = status;
        }

        this.#orderedStatuses = statuses;

        //setting measurement label translation
        this.shadowRoot.querySelector("#measurement-name").textContent = globalThis.translations.sla.labels.slaMeasurementFooter

        this.#slaTooltipManager = new SlaTooltipManager(this);
    }

    /**
     * @method render - Renders the SLA visualization component. We get the data from the data manager and render the SLA grid. If there is no data we show a no content message.
     * @returns {Promise<void>}
     */
    async render() {
        let data = await crs.call("data_manager", "get_all", { manager: this.dataset.manager });

        this.#container.innerHTML = "";
        this.#statusLabelContainer.innerHTML = "";
        const gridParentContainer = this.shadowRoot.querySelector("#grid-parent-container");

        if (data[0]?.measurements?.length > 0) {
            this.classList.remove("no-content")
            const slaData = {
                sla: data,
                statuses: this.#statusLookupTable,
                orderedStatuses: this.#orderedStatuses,
                currentStatus: this.#currentStatus || "",
                currentStatusIndex: this.#currentStatusIndex,
            }

            await create_sla_grid(slaData, this.#container, this.#statusLabelContainer, this);

            //phaseType can either be runtime or setup
            const phaseType = this.dataset.phase;

            await crs.call("sla_layer", "create_all_sla", { parent: this.#container, data: slaData , parentPhase: phaseType}); // refactor for phase

            if (phaseType === "runtime") {
                await this.#updateSlaLegend(data);
                const activeStatusRow = gridParentContainer.querySelector(".status-label.active-status-label");
                activeStatusRow.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'start'});
            }
        }
        else{
            this.classList.add("no-content");
            await crs.call("no_content", "show", { parent: gridParentContainer });
        }
    }

    /**
     * @method #selectionChanged - Handles the selection change event on the SLA visualization. We dispatch an event to notify the selected measurements have changed
     * @param selectedMeasurements {Array} - the selected measurements
     * @returns {Promise<void>}
     */
    async #selectionChanged(selectedMeasurements) {
        this.#selectedMeasurement = selectedMeasurements;
        this.dispatchEvent(new CustomEvent("selectedMeasurementsChange", {detail: {selected: selectedMeasurements}}));
    }

    /**
     * @method #hookDataManager - Hooks into the data manager to listen for changes.
     * @returns {Promise<void>}
     */
    async #hookDataManager(){
        await crs.call("data_manager", "on_change", {
            manager: this.dataset.manager,
            callback: this.#dataManagerChangedHandler
        });
    }

    /**
     * @method #dataManagerChanged - Handles the data manager change event. We call the relevant method based on the action type.
     * @param args {object} - the data manager change event arguments
     * @returns {Promise<void>}
     */
    async #dataManagerChanged(args){
        await this.#changeEventMap[args.action].call(this, args);
    }

    /**
     * @method #refresh - Refreshes the SLA visualization component.
     * @param args {object} - the data manager change event arguments
     * @returns {Promise<void>}
     */
    async #refresh(args){
        await crs.call("sla_visualization", "render", {
            element: this,
            statuses: this.#statusLookupTable,
            currentStatus: this.#currentStatus
        });
    }

    /**
     * @method enable - Enables the SLA visualization component. We hook into the data manager and request the records.
     * @returns {Promise<void>}
     */
    async enable() {
        await this.#hookDataManager();
        await crs.call("data_manager", "request_records", {manager: this.dataset.manager});
    }

    /**
     * @method disable - Disables the SLA visualization component. We remove the change event listener from the data manager
     * @returns {Promise<void>}
     */
    async disable() {
        await crs.call("data_manager", "remove_change", {manager: this.dataset.manager, callback: this.#dataManagerChangedHandler});
    }

    /**
     * @method #updateSlaLegend - Updates the SLA legend with the relevant counts for each measurement state.
     * @param data {Array} - the data that contains all the sla information we use to update the SLA legend.
     * @returns {Promise<void>}
     */
    async #updateSlaLegend(data) {
        // USE THE DATA
        const legend = this.shadowRoot.querySelector("#sla-legend");
        //inflate the legend
        await crsbinding.staticInflationManager.inflateElement(legend, globalThis.translations.sla.labels);

        // Initialize the counts for each state
        const stateCounts = {
            active: 0,
            inactive: 0,
            warning: 0,
            overdue: 0
        };

        for (const sla of data) {
            for (const measure of sla.measurements) {
                if (this.#currentStatusIndex < measure.start_status_order || this.#currentStatusIndex > measure.end_status_order) {
                    stateCounts.inactive++;
                } else {
                    if (measure.progress > 100) {
                        stateCounts.overdue++;
                    }
                    else if (measure.progress >= 80 && measure.progress <= 99) {
                        stateCounts.warning++;
                    }

                    stateCounts.active++;
                }
            }
        }

        // Important note we use the indexes of the stateCount to match to the UI. This makes it faster to update the UI

        const listItems = legend.querySelectorAll("li span");
        const stateKeys = Object.keys(stateCounts);
        for (let i = 0; i < listItems.length; i++) {
            listItems[i].textContent = stateCounts[stateKeys[i]];
        }
    }

}

customElements.define("sla-visualization", SlaVisualization);