/**
 * @const SORT_DIRECTION - this is used to define the sort direction for the entities.
 * @type {Readonly<{ASCENDING: string, DESCENDING: string}>}
 */
const SORT_DIRECTION = Object.freeze({
    ASCENDING: "ascending",
    DESCENDING: "descending"
})

/**
 * @const SORT_ICONS - this is used to define the icons for the sort direction.
 * @type {Readonly<{[p: string]: string}>}
 */
const SORT_ICONS = Object.freeze({
  [SORT_DIRECTION.ASCENDING]: "sort-ascending",
  [SORT_DIRECTION.DESCENDING]: "sort-descending"
})


/**
 * @class EntityDetails - this is the main component that will display the entities and their items.
 */
export default class EntityDetails extends HTMLElement {

    #clickHandler = this.#click.bind(this);
    #sortDirection = SORT_DIRECTION.ASCENDING;
    #showIds = false;

    /**
     * @constructor - this will create the shadow root and attach it to the component.
     */
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    /**
     * @method connectedCallback - this is the main function that will be called when the component is attached to the DOM.
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        const css = `<link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">`;
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = `${css}${html}`;
        await crsbinding.translations.parseElement(this.shadowRoot.querySelector("header"));
        requestAnimationFrame(() => this.init())
    }

    /**
     * @method init - this function loads resources and sets up the component.
     * @returns {Promise<void>}
     */
    async init() {
        this.addEventListener("click", this.#clickHandler);
        await this.#refresh();
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#sortDirection = null;
        this.#clickHandler = null;
        this.#showIds = null;
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
     * @method refresh - this is the main function that starts the drawing process.
     * This is used both internally and externally to refresh the component.
     * This function will request via event for the initial data to be loaded if the data parameter is not defined
     *
     * @returns {Promise<void>}
     * @param {Object} data - the data to be used to draw the component if this is empty it will request it from the server
     * using a event
     */
    async #refresh() {
        const args = { sortDirection: this.#sortDirection, showIds: this.#showIds };
        this.dispatchEvent(new CustomEvent("get_entities", { detail: args }));
    }


    /**
     * @method drawEntities - this will take the data and draw the entities on the screen.
     * The entity UI is by default collapsed and will expand when clicked.
     * @param data
     * @returns {Promise<void>}
     */
    async #drawEntities(data) {
        const itemsContainer = this.shadowRoot.querySelector(".items");
        itemsContainer.innerHTML = "";

        const entityTemplate = this.shadowRoot.querySelector("#entity-template");

        const fragment = document.createDocumentFragment()
        for (const entity of data) {
            const clone = createEntityItem(entityTemplate, entity);
            fragment.appendChild(clone);
        }
        itemsContainer.appendChild(fragment);

        requestAnimationFrame(async () => {
            if (this.dataset.ready !== "true") {
                await crs.call("component", "notify_ready", { element: this });
            }
        })
    }

    async #drawEntityItems(target, data) {
        const entityItemTemplate = this.shadowRoot.querySelector("#entity-item-template");
        const ruleItemTemplate = this.shadowRoot.querySelector("#rule-item-template");

        const fragment = document.createDocumentFragment();
        for (const entityItems of data) {
            const clone = entityItemTemplate.content.cloneNode(true);
            clone.querySelector(".value").textContent = entityItems.value;
            clone.querySelector(".description").textContent = entityItems.descriptor || "";
            const container = clone.querySelector("ul");
            await this.#drawRules(container, entityItems.rules, ruleItemTemplate);
            fragment.appendChild(clone);
        }
        target.appendChild(fragment);
    }

    async #drawRules(target, data, ruleItemTemplate) {
        const fragment = document.createDocumentFragment();
        for (const item of data) {
            const clone = ruleItemTemplate.content.cloneNode(true);
            clone.querySelector(".value").textContent = item.value;
            clone.querySelector(".description").textContent = item.descriptor || "";
            fragment.appendChild(clone);
        }
        target.appendChild(fragment);
    }

    async #collapse(target) {
        target.querySelector("ul").innerHTML = "";
        target.setAttribute("aria-expanded", "false");
    }

    /**
     * @method collapseAll - this will collapse all the entities on the screen.
     * This is executed from the click event based on a data-action attribute.
     * @returns {Promise<void>}
     */
    async collapseAll(event) {
        const entities = this.shadowRoot.querySelectorAll('.entity-item');

        for (const entity of entities) {
            await this.#collapse(entity);
        }
    }

    async sort(event) {
        const target = event.composedPath()[0];
        this.#sortDirection = this.#sortDirection == SORT_DIRECTION.ASCENDING ? SORT_DIRECTION.DESCENDING : SORT_DIRECTION.ASCENDING;
        target.textContent = SORT_ICONS[this.#sortDirection];
    }

    async expand(event) {
        const target = event.composedPath()[0];
        const listItem = target.closest("li");

        if (listItem.getAttribute("aria-expanded") == "true") {
            return await this.#collapse(listItem);
        }

        listItem.setAttribute("aria-expanded", "true");
        const args = { componentId: this.id, entityId: listItem.dataset.id, sortDirection: this.#sortDirection, showIds: this.#showIds }
        this.dispatchEvent(new CustomEvent("get_entity_items", { detail: args }));
    }

    async setShowIds(event) {
        const target = event.composedPath()[0];
        this.#showIds = target.checked;
        console.log(this.#showIds)
    }

    async addEntities(data) {
        await this.#drawEntities(data);
    }

    async addEntityItems(data, entityId) {
        const target = this.shadowRoot.querySelector(`[data-id="${entityId}"] ul`);
        await this.#drawEntityItems(target, data);
    }

    async onMessage(event) {
        this[event.action](event.data, event.entityId);
    }
}

function createEntityItem(entityTemplate, entity) {
    const clone = entityTemplate.content.cloneNode(true);
    const entityElement = clone.querySelector("li");
    entityElement.dataset.id = entity.id;
    entityElement.querySelector(".entity-value").textContent = entity.value;
    entityElement.querySelector(".entity-count").textContent = entity.count;
    return clone;
}

customElements.define("entity-details", EntityDetails);