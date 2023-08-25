import "./../../components/entity-details/entity-details.js";

export default class EntityDetails extends crsbinding.classes.ViewBase {
    #details;
    #getEntitiesHandler = this.#getEntities.bind(this);
    #getEntityItemsHandler = this.#getEntityItems.bind(this);

    async load() {
        await crsbinding.translations.add({
            collapseAll: "Collapse All",
            showIds: "Show Ids",
        }, "entityDetails");

        this.#details = this.element.querySelector("entity-details");
        this.#details.addEventListener("get_entities", this.#getEntitiesHandler);
        this.#details.addEventListener("get_entity_items", this.#getEntityItemsHandler);
        super.load()
    }

    async disconnectedCallback() {
        this.#details.removeEventListener("get_entities", this.#getEntitiesHandler);
        this.#details.removeEventListener("get_entity_items", this.#getEntityItemsHandler);
        this.#details = null;
        super.disconnectedCallback();
    }

    async #getEntities(event) {
        event.detail.data = [
            {id: "e1", name: "Entity 1", count: 2},
            {id: "e2", name: "Entity 2", count: 100},
            {id: "e3", name: "Entity 3", count: 50},
            {id: "e4", name: "Entity 4", count: 10},
            {id: "e5", name: "Entity 5", count: 100},
        ]
    }

    #getEntityItems(event) {
        const count = { e1: 2, e2: 100, e3: 50, e4: 10, e5: 100 }[event.detail.entityId];
        console.log(count);
    }
}