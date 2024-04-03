import "./../../components/sla-visualization/sla-measurement/sla-measurement.js";
import "./../../components/sla-visualization/sla-measurement/sla-measurement-actions.js";
import "./../../components/sla-visualization/sla-layer/sla-layer.js";
import "./../../components/sla-visualization/sla-layer/sla-layer-actions.js";
import {myData1, myData2, myData3} from "./data.js";

export default class TestCssGrid extends crs.classes.BindableElement {
    #clickHandler = this.#click.bind(this);

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.slaParent = this.shadowRoot.querySelector("#sla-container2")
        this.shadowRoot.addEventListener("click", this.#clickHandler);
    }

    async disconnectedCallback() {
        this.data = null;
        this.slaParent = null;
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
    }

    async #click(event){
        const target = event.composedPath()[0];
        console.log(target.id)
        if (target.id === 'sla-update-1') {
            await this.updateProgress(event, myData2);
        } else if (target.id === 'sla-randomize-1') {
            await this.randomizeProgress(event, myData2);
        } else if (target.id === 'remove-sla-1') {
            await this.removeSlaMeasurement(event);
        }
        else if (target.id === 'create-sla-1') {
            await this.createSlaMeasurement(event, this.slaParent, myData1);
        }
        else if (target.id === 'sla-update-2') {
            await this.updateProgress(event, myData1);
        }
        else if (target.id === "create-sla-layer") {
            await this.createSlaLayer(event, this.slaParent, myData3);
        }
    }

    async updateProgress(event, data) {
        for (const item of data) {
            await crs.call("sla_measurement", "update", {
                element: this.shadowRoot.querySelector(`[id="${item.id}"]`), // Use item.id to access the ID
                progress: item.measurements[0].progress
            });
        }
    }


    async randomizeProgress(event, data) {
        for (const item of data) {
            // Randomize progress value
            item.measurements[0].progress = Math.floor(Math.random() * 100);

            // Toggle data-active state
            const dataActiveState = toggleDataActive(); // Assuming toggleDataActive() returns "true" or "false" randomly
            const element = this.shadowRoot.querySelector(`[id="${item.id}"]`); // Accessing the id property correctly
            element.setAttribute("data-status", dataActiveState);
        }

        // Call updateProgress with the updated data
        await this.updateProgress(null, data); // Pass null as the event parameter since it's not used in updateProgress
    }


    async createSlaMeasurement(event, parent, data) {
        await crs.call("sla_measurement", "create", {
            parent: parent,
            data: data
        });
    }

    async removeSlaMeasurement(event) {

        const slaElement = this.shadowRoot.querySelector("#sla-id-input").value;
        await crs.call("sla_measurement", "remove_sla", {
            element: this,
            id: slaElement.toString()
        });
    }

    async createSlaLayer(event, parent, data) {
        const slaLayerParent = this.shadowRoot.querySelector("#sla-layer-grid");
        await crs.call("sla_layer", "create_all_sla", {
            parent: slaLayerParent,
            data: data
        });
    }
}

function getRandomBoolean() {
    return Math.random() < 0.5; // Generates a random boolean value
}

function toggleDataActive() {
    const isActive = getRandomBoolean(); // Get random boolean value
    const dataActiveState = isActive ? "active" : "inactive"; // Convert boolean to string "true" or "false"
    return dataActiveState;
}