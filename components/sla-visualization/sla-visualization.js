import {create_sla_grid} from "./sla-utils/sla-grid-utils.js"
import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";
import "../../packages/crs-process-api/action-systems/no-content-actions.js";
import {SlaTooltipManager} from "./sla-tooltip/sla-tooltip-manager.js";

/**
 * @class SlaVisualization - This class is responsible for rendering the SLA visualization.
 * @extends crs.classes.BindableElement
 *
 *
 **/
export class SlaVisualization extends HTMLElement {
    #dataManagerChangedHandler = this.#dataManagerChanged.bind(this);
    #changeEventMap = {
        [CHANGE_TYPES.refresh]: this.#refresh
    };

    #currentStatusIndex;
    #statuses;
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
    #labelContainer;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get selectedMeasurements() {
        return this.#selectedMeasurement;
    }

    set selectedMeasurements(newValue) {
        this.#selectedMeasurement = newValue;
        this.dispatchEvent(new CustomEvent("selectedMeasurementsChange", {detail: {selected: newValue}}));
    }

    get currentStatus() {
        return this.#currentStatus;
    }

    set currentStatus(newValue) {
        this.#currentStatus = newValue;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = html;
        this.#container = this.shadowRoot.querySelector("#sla-grid-container");
        this.#labelContainer = this.shadowRoot.querySelector("#grid-label-container");
        this.addEventListener("measurement-selected", this.#selectionChangedHandler);
        // this.addEventListener("contextmenu", this.#contextMenuHandler);
        this.addEventListener("click", this.#clickHandler);
        this.addEventListener("wheel", this.#scaleHandler);
    }

    async disconnectedCallback() {
        // this.removeEventListener("contextmenu", this.#contextMenuHandler);
        this.removeEventListener("click", this.#clickHandler);
        this.removeEventListener("wheel", this.#scaleHandler);
        this.#clickHandler = null;
        this.#scaleHandler = null;
        this.#contextMenuHandler = null;
        await crs.call("data_manager", "remove_change", {manager: this.dataset.manager, callback: this.#dataManagerChangedHandler});
        this.#dataManagerChangedHandler = null;
        this.#changeEventMap = null;
        this.#statuses = null;
        this.#currentStatus = null;
        this.#container = null;
        this.removeEventListener("measurement-selected", this.#selectionChangedHandler);
        this.#selectionChangedHandler = null;
        this.#selectedMeasurement = null;
        this.#currentScale = null;
        this.#labelContainer = null;

        if (this.#slaTooltipManager == null) return;

        await this.#slaTooltipManager.dispose(this);
        this.#slaTooltipManager = null;
    }

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

    async #scaleGridVisualization(event) {
        if (event.ctrlKey === false) return;

        event.preventDefault();

        const zoomScale =  event.deltaY < 0 ? 0.1 : -0.1;

        if (zoomScale > 0 && this.#currentScale === 1 || zoomScale < 0 && this.#currentScale === 0.1) return;

        this.#currentScale += zoomScale;

        // Round the scale value to one decimal place
        this.#currentScale = Math.round(this.#currentScale * 10) / 10;

        this.style.setProperty('--scale', this.#currentScale);
    }

    async initialize(statuses, currenStatus) {
        this.#statuses = {};
        this.#currentStatus = currenStatus
        let index = 0;
        for (const status of statuses) {
            if(status.id === this.#currentStatus){
                this.#currentStatusIndex = index;
            }
            status.order = index++;
            this.#statuses[status.id] = status;
        }

        this.#orderedStatuses = statuses;

        //setting measurement label translation
        this.shadowRoot.querySelector("#measurement-name").textContent = globalThis.translations.sla.labels.slaMeasurementFooter

        await crs.call("component", "notify_ready", { element: this });
        this.#slaTooltipManager = new SlaTooltipManager(this);
    }

    async render() {
        let data = await crs.call("data_manager", "get_all", { manager: this.dataset.manager });

        this.#container.innerHTML = "";
        this.#labelContainer.innerHTML = "";
        const gridParentContainer = this.shadowRoot.querySelector("#grid-parent-container");

        if (data[0]?.measurements?.length > 0) {
            this.#container.style.justifyContent = "";
            const slaData = {
                sla: data,
                statuses: this.#statuses,
                orderedStatuses: this.#orderedStatuses,
                currentStatus: this.#currentStatus || "",
                currentStatusIndex: this.#currentStatusIndex,
            }

            await create_sla_grid(slaData, this.#container, this.#labelContainer, this);

            //phaseType can either be runtime or setup
            const phaseType = this.dataset.phase;

            await crs.call("sla_layer", "create_all_sla", { parent: this.#container, data: slaData , parentPhase: phaseType}); // refactor for phase


            if (phaseType === "runtime") {
                await this.#updateSlaLegend(data);
                const activeStatusRow = gridParentContainer.querySelector("[class='status-label active-status-label']");
                activeStatusRow.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'start'});
            }
        }
        else{
            this.shadowRoot.querySelector("#sla-legend").style.display = "none";
            this.#container.style.justifyContent = "center";
            this.#container.style.display = "flex";
            await crs.call("no_content", "show", { parent: gridParentContainer });
        }
    }

    async #selectionChanged(selectedMeasurements) {
        this.selectedMeasurements = selectedMeasurements;
    }

    async #hookDataManager(){
        await crs.call("data_manager", "on_change", {
            manager: this.dataset.manager,
            callback: this.#dataManagerChangedHandler
        });
    }

    async #dataManagerChanged(args){
        await this.#changeEventMap[args.action].call(this, args);
    }

    async #refresh(args){
        await crs.call("sla_visualization", "render", {
            element: this,
            statuses: this.#statuses,
            currentStatus: this.#currentStatus
        });
    }

    async enable() {
        await this.#hookDataManager();
        await crs.call("data_manager", "request_records", {manager: this.dataset.manager});
    }

    async disable() {
        await crs.call("data_manager", "remove_change", {manager: this.dataset.manager, callback: this.#dataManagerChangedHandler});
    }

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