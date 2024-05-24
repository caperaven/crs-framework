import {create_sla_grid} from "./sla-grid-utils.js"
import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";
import "../../packages/crs-process-api/action-systems/no-content-actions.js";

/**
 * @class SlaVisualization - This class is responsible for rendering the SLA visualization.
 * @extends crs.classes.BindableElement
 *
 *
 **/
export class SlaVisualization extends crsbinding.classes.BindableElement {
    #dataManagerChangedHandler = this.#dataManagerChanged.bind(this);
    // #selectionChanged = this.#selectionChanged.bind(this);
    #changeEventMap = {
        [CHANGE_TYPES.refresh]: this.#refresh,
        [CHANGE_TYPES.selected]: this.#selectionChanged
    };

    #statuses;
    #currentStatus;
    #container;
    #selectionChangedHandler = this.#selectionChanged.bind(this);

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
        await this.#hookDataManager();
        this.#container = this.shadowRoot.querySelector("#sla-grid-container");
        this.addEventListener("measurement-selected", this.#selectionChangedHandler);
    }

    async disconnectedCallback() {
        await crs.call("data_manager", "remove_change", {manager: this.dataset.manager, callback: this.#dataManagerChangedHandler});
        this.#dataManagerChangedHandler = null;
        this.#changeEventMap = null;
        this.#statuses = null;
        this.#currentStatus = null;
        this.#container = null;
        this.removeEventListener("measurement-selected", this.#selectionChangedHandler);
        this.#selectionChangedHandler = null;
        await super.disconnectedCallback();
    }

    async initialize(statuses, currentStatus) {
        await crs.call("component", "notify_loading", {element: this});
        this.#statuses = statuses;
        this.#currentStatus = currentStatus;

        await crs.call("component", "notify_ready", { element: this });
    }

    async render() {
        const data = await crs.call("data_manager", "get_all", { manager: this.dataset.manager });

        this.#container.innerHTML = "";

        if (data?.length > 0) {
            this.#container.style.justifyContent = "";
            const slaData = {
                sla: data,
                statuses: this.#statuses,
                currentStatus: this.#currentStatus
            }

            await create_sla_grid(slaData, this.#container, this);
            await crs.call("sla_layer", "create_all_sla", { parent: this.#container, data: slaData , parentPhase: this.dataset.phase}); // refactor for phase
            await this.#updateSlaLegend();
        }
        else{
            this.#container.style.justifyContent = "center";
            return await crs.call("no_content", "show", { parent: this.#container });
        }
    }

    async #selectionChanged(args){
        console.log("Selected changed: ", args);
        await crs.call("data_manager", "set_selected", {manager: this.dataset.manager, ids: args.detail.selected});
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
        // ToDo: Implement clear existing sla's and recreate them
            await crs.call("sla_visualization", "render", {
                element: this
            });
    }

    async enable() {
        await crs.call("data_manager", "request_records", {manager: this.dataset.manager});
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