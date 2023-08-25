export default class EntityDetails extends HTMLElement {

    #clickHandler = this.#click.bind(this);

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        const css = `<link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">`;
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = `${css}${html}`;
        await crsbinding.translations.parseElement(this.shadowRoot.querySelector("header"));
        requestAnimationFrame(() => this.init())
    }

    async init() {
        this.addEventListener("click", this.#clickHandler);
        this.addEventListener("dblclick", this.#clickHandler);

        await this.refresh();

        await crs.call("component", "notify_ready", { element: this });
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.removeEventListener("dblclick", this.#clickHandler);

        this.#clickHandler = null;
    }

    /**
     * @method #click - this is the click handler for the component
     * Look for data-action attributes that will affect what is being done.
     * @param event
     */
    #click(event) {
        const target = event.composedPath()[0];
        const action = target.dataset.action;

        if (this[action] != null) {
            this[action](event);
        }
    }


    /**
     * @method drawEntities - this will take the data and draw the entities on the screen.
     * The entity UI is by default collapsed and will expand when clicked.
     * @param data
     * @returns {Promise<void>}
     */
    async #drawEntities(data) {
        console.log(data);
    }

    async #drawEntityItems(target, data) {

    }

    async collapseAll() {
        const entities = this.shadowRoot.querySelectorAll('li [data-action="expand"]');

        for (const entity of entities) {
            entity.querySelector("ul").innerHTML = ""
        }
    }

    async expand(event) {
        const target = event.composedPath()[0];

        const args = {
            entityId: target.dataset.id,
            data: null
        }

        this.dispatchEvent(new CustomEvent("get_entity_items", { detail: args }));

        await this.#drawEntityItems(target, args.data);
    }

    /**
     * @method refresh - this is the main function that starts the drawing process.
     * This is used both internally and externally to refresh the component.
     * This function will request via event for the initial data to be loaded if the data parameter is not defined
     *
     * @returns {Promise<void>}
     * @param {Object} data - the data to be used to draw the component if this is empty it will request it from the server
     * using a event
     */
    async refresh() {
        const args = { data: null };
        this.dispatchEvent(new CustomEvent("get_entities", { detail: args }));

        if (args.data != null) {
            await this.#drawEntities(args.data);
        }
    }
}

customElements.define("entity-details", EntityDetails);


// const entityItem = {
//     "entityid": 123,
//     "value": "__id or code value__",
//     "descriptor": "none or value of description",
//     "rules": [
//         {
//             "value": "__id or code value__",
//             "descriptor": "none or value of description",
//         }
//     ]
// }