import "./../../components/entity-details/entity-details.js";

export default class EntityDetails extends crsbinding.classes.ViewBase {
    #details;
    #getEntitiesHandler = this.#getEntities.bind(this);
    #getEntityItemsHandler = this.#getEntityItems.bind(this);

    #entities = null;

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
        this.#entities = [
            {entityType: "Entity 1", entityIds: [1, 2, 3]},
            {entityType: "Entity 2", entityIds: [4, 5, 6]},
            {entityType: "Entity 3", entityIds: [7, 8, 9]},
            {entityType: "Entity 4", entityIds: [10, 11, 12]},
            {entityType: "Entity 5", entityIds: [13, 14, 15]},
        ]

        await crsbinding.events.emitter.postMessage("entity-details", { action: "addEntities", data: this.#entities })
    }

    async #getEntityItems(event) {
        const entityType = event.detail.entityType;
        const entityIds = event.detail.entityIds;
        const count = entityIds.length;
        const ruleCount = await crs.call("random", "integer", { min: 1, max: 9 });

        const data = [];
        for (let i = 0; i < count; i++) {
            const entityItem = {
                id: `e${i}`,
                code: `Item ${i}`,
                descriptor: `Item ${i} Description`,
                rules: []
            }

            for (let j = 0; j < ruleCount; j++) {
                const rule = {
                    code: `Rule ${j}`,
                    descriptor: `Rule ${j} Description`,
                }
                entityItem.rules.push(rule);
            }

            data.push(entityItem);
        }

        event.detail.data = data;

        await crsbinding.events.emitter.postMessage("entity-details", { action: "addEntityItems", entityType: entityType, data: data })
    }


}