import {create_sla_grid} from "./sla-grid-utils.js"
import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";
import "../../packages/crs-process-api/action-systems/no-content-actions.js";

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

    #isInitialized = false;
    #statuses;
    #selectedMeasurement;
    #currentStatus;
    #container;
    #selectionChangedHandler = this.#selectionChanged.bind(this);

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

    get initialized() {
        return this.#isInitialized;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = html;
        this.#container = this.shadowRoot.querySelector("#sla-grid-container");
        this.addEventListener("measurement-selected", this.#selectionChangedHandler);
        await this.render();
    }

    async disconnectedCallback() {
        await crs.call("data_manager", "remove_change", {manager: this.dataset.manager, callback: this.#dataManagerChangedHandler});
        this.#dataManagerChangedHandler = null;
        this.#changeEventMap = null;
        this.#isInitialized = null;  // toDo: Ask Gerhard if this is correct
        this.#statuses = null;
        this.#currentStatus = null;
        this.#container = null;
        this.removeEventListener("measurement-selected", this.#selectionChangedHandler);
        this.#selectionChangedHandler = null;
        this.#selectedMeasurement = null;
    }

    async initialize(statuses, currenStatus) {
        this.#statuses = statuses;
        this.#currentStatus = currenStatus
        this.#isInitialized = true;
        await crs.call("component", "notify_ready", { element: this });
    }

    async render() {
        let data = await crs.call("data_manager", "get_all", { manager: this.dataset.manager });

        this.#container.innerHTML = "";


        // take the #status, loop through them and assign a property to each of them called status order with a value from 1 to the number of statuses
        this.#statuses.forEach((status, index) => {
            status.order = index + 1;
        });


        if (data[0]?.measurements?.length > 0) {
            this.#container.style.justifyContent = "";
            const slaData = {
                sla: data,
                statuses: this.#statuses,
                currentStatus: this.#currentStatus || "",
            }

            await create_sla_grid(slaData, this.#container, this);
            await crs.call("sla_layer", "create_all_sla", { parent: this.#container, data: slaData , parentPhase: this.dataset.phase}); // refactor for phase
            if (this.dataset.phase === "runtime") {
                await this.#updateSlaLegend();
            }
        }
        else{
            this.shadowRoot.querySelector("#sla-legend").style.display = "none";
            this.#container.style.justifyContent = "center";
            this.#container.style.display = "flex";
            await crs.call("no_content", "show", { parent: this.#container });
        }
    }

    async #selectionChanged(args){
        this.selectedMeasurements = args.detail.selected;
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

    async #updateSlaLegend() {
        const slaList = this.#container.querySelectorAll("sla-layer");
        const legend = this.shadowRoot.querySelector("#sla-legend");

        // Initialize the counts for each state
        const stateCounts = {
            active: 0,
            inactive: 0,
            warning: 0,
            overdue: 0
        };

        // Iterate through each sla-layer
        for (const sla of slaList) {
            // Get the measurements within the sla-layer
            const measurementsList = sla.shadowRoot.querySelectorAll("sla-measurement");

            // Iterate through each measurement
            for (const measurement of measurementsList) {
                // Get the state of the measurement
                const state = measurement.dataset.state;

                // Increase the count for the respective state
                if (stateCounts.hasOwnProperty(state)) {
                    stateCounts[state]++;
                } else {
                    console.warn(`Unexpected state: ${state}`);
                }
            }
        }

        // Use the state counts as needed
        console.log(stateCounts);
        // Mapping from state keys to HTML element IDs
        const mapping = {
            active: 'in-range',
            inactive: 'out-of-range',
            warning: 'warning',
            overdue: 'overdue'
        };

        // Update the legend with the state counts
        for (const state in stateCounts) {
            if (stateCounts.hasOwnProperty(state)) {
                const count = stateCounts[state];
                const elementId = mapping[state];
                const listItem = legend.querySelector(`#${elementId}`);
                if (listItem) {
                    const span = listItem.querySelector('span');
                    if (span) {
                        span.textContent = count;
                    }
                }
            }
        }
    }

}

customElements.define("sla-visualization", SlaVisualization);