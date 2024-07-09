import {create_sla_grid} from "./sla-utils/sla-grid-utils.js"
import {CHANGE_TYPES} from "../../src/managers/data-manager/data-manager-types.js";
import "../../packages/crs-process-api/action-systems/no-content-actions.js";
import {SlaTooltipManager} from "./sla-utils/sla-tooltip-manager.js";

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
    #selectedMeasurement;
    #currentStatus;
    #container;
    #selectionChangedHandler = this.#selectionChanged.bind(this);
    #slaTooltipManager;

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
        this.#selectedMeasurement = null;
        this.#slaTooltipManager.dispose();
        this.#slaTooltipManager = null;
    }

    async initialize(statuses, currenStatus) {
        this.#statuses = {};
        this.#currentStatus = currenStatus
        let index = 0;
        for (const status of statuses) {
            if(status.description === this.#currentStatus){
                // TODO BUG DESCRIPTIONS CAN BE THE SAME
                this.#currentStatusIndex = index;
            }
            status.order = index++;
            this.#statuses[status.code] = status;
        }

        await crs.call("component", "notify_ready", { element: this });
        this.#slaTooltipManager = new SlaTooltipManager(this);
    }

    async render() {
        let data = await crs.call("data_manager", "get_all", { manager: this.dataset.manager });

        this.#container.innerHTML = "";

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
                await this.#updateSlaLegend(data);
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

    async #updateSlaLegend(data) {
        // USE THE DATA
        const legend = this.shadowRoot.querySelector("#sla-legend");

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
                }
                else {
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