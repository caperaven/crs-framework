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
        const data = [
            {id: "e1", value: "Entity 1", count: 2},
            {id: "e2", value: "Entity 2", count: 5},
            {id: "e3", value: "Entity 3", count: 10},
            {id: "e4", value: "Entity 4", count: 10},
            {id: "e5", value: "Entity 5", count: 3},
        ]

        await crsbinding.events.emitter.postMessage("entity-details", { action: "addEntities", data: data })
    }

    async #getEntityItems(event) {
        const count = { e1: 2, e2: 5, e3: 10, e4: 10, e5: 3 }[event.detail.entityId];
        const ruleCount = await crs.call("random", "integer", { min: 1, max: 100 });

        const data = [];
        for (let i = 0; i < count; i++) {
            const entityItem = {
                id: `e${i}`,
                value: `Item ${i}`,
                descriptor: `Item ${i} Description`,
                rules: []
            }

            for (let j = 0; j < ruleCount; j++) {
                const rule = {
                    value: `Rule ${j}`,
                    descriptor: `Rule ${j} Description`,
                }
                entityItem.rules.push(rule);
            }

            data.push(entityItem);
        }

        event.detail.data = data;

        await crsbinding.events.emitter.postMessage("entity-details", { action: "addEntityItems", entityId: event.detail.entityId, data: data })
    }


}