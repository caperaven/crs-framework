import "./../../components/entity-details/entity-details.js";
import "./../../packages/crs-process-api/action-systems/no-content-actions.js"

export default class EntityDetails extends crsbinding.classes.ViewBase {
    #details;
    #getEntitiesHandler = this.#getEntities.bind(this);
    #getEntityItemsHandler = this.#getEntityItems.bind(this);
    #openEntityDetailsHandler = this.#openEntityDetails.bind(this);

    #entities = null;

    constructor() {
        super();
        globalThis.translations ||= {}

        globalThis.translations.treeTranslations = {
            "developmentStatus": {
                "Confirmed": "Confirmed",
                "NewUnderDevelopment": "New - Under Development",
                "NewAwaitingConfirmation": "New - Awaiting Confirmation",
                "ModifiedUnderDevelopment": "Modified - Under Development",
                "ModifiedAwaitingConfirmation": "Modified - Awaiting Confirmation",
                "DeletedAwaitingConfirmation": "Deleted - Awaiting Confirmation",
                "DeletedConfirmed": "Deleted - Confirmed"
            }
        }

        globalThis.translations.noContent = {
            title: "No Records Found",
            message: "Either you do not have sufficient user rights required to display the records or there are no records to be displayed."
        }

        globalThis.translations.entityDetails = {
           collapseAll: "Collapse All"
        }
    }

    async load() {
        await crsbinding.translations.add({
            collapseAll: "Collapse All",
        }, "entityDetails");

        this.#details = this.element.querySelector("entity-details");
        this.#details.addEventListener("get_entities", this.#getEntitiesHandler);
        this.#details.addEventListener("get_entity_items", this.#getEntityItemsHandler);
        this.#details.addEventListener("open_entity_details", this.#openEntityDetailsHandler);
        super.load()
    }

    async disconnectedCallback() {
        this.#details.removeEventListener("get_entities", this.#getEntitiesHandler);
        this.#details.removeEventListener("get_entity_items", this.#getEntityItemsHandler);
        this.#details.removeEventListener("open_entity_details", this.#openEntityDetailsHandler);
        this.#details = null;
        this.#getEntitiesHandler = null;
        this.#getEntityItemsHandler = null;
        this.#openEntityDetailsHandler = null;
        this.#entities = null;
        super.disconnectedCallback();
    }

    async #getEntities(event) {
        this.#entities = [
            {entityType: "Entity 1", title:  "Entity 1", entityIds: [1, 2, 3]},
            {entityType: "Entity 2", title: "Entity 2", entityIds: [4, 5, 6]},
            {entityType: "Entity 3", title: "Entity 3", entityIds: [7, 8, 9]},
            {entityType: "Entity 4", title: "Entity 4", entityIds: [10, 11, 12]},
            {entityType: "Entity 5", title: "Entity 5", entityIds: [13, 14, 15]},
        ]

        await crsbinding.events.emitter.postMessage("entity-details", { action: "addEntities", data: this.#entities })
    }

    async #getEntityItems(event) {
        const entityType = event.detail.entity.entityType;
        const entityIds = event.detail.entity.entityIds;
        const count = entityIds.length;
        const ruleCount = await crs.call("random", "integer", { min: 1, max: 9 });

        const statuses = ["Confirmed", "NewUnderDevelopment", "NewAwaitingConfirmation", "ModifiedUnderDevelopment", "ModifiedAwaitingConfirmation", "DeletedAwaitingConfirmation", "DeletedConfirmed"]

        const data = [];
        for (let i = 0; i < count; i++) {
            const itemStatus = await crs.call("random", "integer", { min: 0, max: 6 });

            const entityItem = {
                id: `e${i}`,
                code: `Item ${i}`,
                descriptor: `Item ${i} Description`,
                status: statuses[itemStatus],
                rules: []
            }

            for (let j = 0; j < ruleCount; j++) {
                const ruleStatus = await crs.call("random", "integer", { min: 0, max: 6 });

                const rule = {
                    id: `r${j}`,
                    code: `Rule ${j}`,
                    descriptor: `Rule ${j} Description`,
                    entityType: "RuleType",
                    status: statuses[ruleStatus]
                }
                entityItem.rules.push(rule);
            }

            data.push(entityItem);
        }

        event.detail.data = data;

        const timeout = setTimeout(async () => {
            clearTimeout(timeout);
            await crsbinding.events.emitter.postMessage("entity-details", { action: "addEntityItems", entityType: entityType, data: data })
        }, 2000);

    }

    async #openEntityDetails(event) {
        console.log(event.detail);
    }
}