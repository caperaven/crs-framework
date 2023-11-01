import "./../cards-manager/cards-manager-actions.js";
// JHR: TODO remove when binding engine is updated
import "./../utils/inflation.js";
import "./../swim-lane/swim-lane.js";

export class KanbanComponent extends HTMLElement {

    #cardHeaderName;
    #cardRecordName;
    #swimLaneCreatedHandle = this.#swimLaneCreated.bind(this);
    #inflateSwimLaneHandler = this.#inflateSwimLane.bind(this);
    #itemSize;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        // 1. load templates before we replace the HTML
        await this.#loadTemplates();
        // 2, replace the html
        const css = `<link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">`;
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = `${css}${html}`;
        await this.load();
    }

    async #loadTemplates() {
        const headerTemplate = this.querySelector("#tplHeader");
        const recordTemplate = this.querySelector("#tplRecord");

        const headerInflateFn = await crs.binding.expression.inflationFactory(headerTemplate);
        const recordInflateFn = await crs.binding.expression.inflationFactory(recordTemplate);

        this.#cardHeaderName = `${this.id}-header`;
        this.#cardRecordName = `${this.id}-record`;

        await crs.call("cards_manager", "register", {
            name: this.#cardHeaderName,
            template: headerTemplate,
            inflationFn: headerInflateFn
        })

        await crs.call("cards_manager", "register", {
            name: this.#cardRecordName,
            template: recordTemplate,
            inflationFn: recordInflateFn
        });

        this.innerHTML = "";
    }

    async load() {
        requestAnimationFrame(async () => {
            await crs.call("component", "notify_loading", { element: this });
        });
    }

    async disconnectedCallback() {
        await crs.call("cards_manager", "unregister", {
            name: this.#cardHeaderName
        })

        await crs.call("cards_manager", "unregister", {
            name: this.#cardRecordName
        });

        this.#cardHeaderName = null;
        this.#cardRecordName = null;
        this.#swimLaneCreatedHandle = null;
        this.#inflateSwimLaneHandler = null;
        this.#itemSize = null;
    }

    async #dataManagerChange(change) {
        if (this[change.action] != null) {
            this[change.action](change);
        }
    }

    async initialize() {
        await crs.call("data_manager", "on_change", {
            manager: this.dataset.manager,
            callback: this.#dataManagerChange.bind(this)
        })

        this.#itemSize = Number(this.dataset.itemSize || 160);

        const ul = this.shadowRoot.querySelector(".swim-lanes-container");
        const template = this.shadowRoot.querySelector("#swimlane-template");

        await crs.call("virtualization", "enable", {
            element: ul,
            manager: this.dataset.manager,
            itemSize: this.#itemSize,
            template,
            inflation: this.#inflateSwimLaneHandler,
            direction: "horizontal",
            created_callback: this.#swimLaneCreatedHandle
        })

        this.dispatchEvent(new CustomEvent("change-settings", {
            // todo: open kan ban settings dialog
            detail: {
                manager: this.dataset.manager
                // pass on current state with all the info the settings needs.
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * @method swimlandCreated - when the swimlane is created set the attributes required for it to function.
     * @param element
     * @returns {Promise<void>}
     */
    async #swimLaneCreated(element) {
        element.firstElementChild.dataset.manager = this.dataset.manager;
        element.firstElementChild.dataset.headerCard = this.#cardHeaderName;
        element.firstElementChild.dataset.recordCard = this.#cardRecordName;
        element.firstElementChild.dataset.cardSize = this.#itemSize;
    }

    /**
     * @method inflateSwimLane - inflate the swimlane with the data.
     * This includes setting of the header information and updating the data if when required.
     * @param element
     * @param data
     * @returns {Promise<void>}
     */
    async #inflateSwimLane(element, data) {
        await element.firstElementChild.setHeader(data.header);
    }

    /**
     * @method - refresh - call this to refresh the component
     * This is typically called when the data manager has changes on the data.
     * @param changes
     * @returns {Promise<void>}
     */
    async refresh(changes) {
        console.log(changes);
    }
}

customElements.define("kanban-component", KanbanComponent);