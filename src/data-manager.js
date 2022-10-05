class BaseDataManager {
    #dataField;
    #count;

    get count() {
        return this.#count;
    }

    constructor(dataField) {
        this.#dataField = dataField;
    }

    setRecords(records) {
        this.#count = records?.length || 0;
    }

    append(count) {
        this.#count = count;
    }

    getAll() {
        return null;
    }

    from_index(index) {
        return null;
    }

    from_id(id) {
        return null;
    }
}

class MemoryDataManager extends BaseDataManager {
    #records;

    setRecords(records) {
        this.#records = records;
        super.setRecords(records);
    }

    append(...record) {
        this.#records.push(...record);
        super.append(this.#records.length);
    }

    getAll() {
        return this.#records;
    }

    getIndex(index) {
        return this.#records[index];
    }

    getId(id) {
        return null;
    }
}

class IndexDBDataManager extends BaseDataManager {
    setRecords(records) {
        super.setRecords(records);
    }
}

const managerTypes = Object.freeze({
    "memory": MemoryDataManager,
    "indexdb": IndexDBDataManager
})

class DataManagerStore {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async register(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const dataField = await crs.process.getValue(step.args.id_field || "id", context, process, item);
        const type = await crs.process.getValue(step.args.type || "indexdb", context, process, item);
        const records = await crs.process.getValue(step.args.records || [], context, process, item);

        globalThis.dataManagers ||= {};

        if (globalThis.dataManagers[manager] == null) {
            globalThis.dataManagers[manager] = new managerTypes[type](dataField);
        }

        globalThis.dataManagers[manager].setRecords(records);
        return globalThis.dataManagers[manager];
    }

    static async set_records(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const records = await crs.process.getValue(step.args.records || [], context, process, item);
        globalThis.dataManagers[manager].setRecords(records);
    }

    static async append(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const records = await crs.process.getValue(step.args.records || [], context, process, item);
        globalThis.dataManagers[manager].append(...records);
    }

    static async remove(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const indexes = await crs.process.getValue(step.args.indexes, context, process, item);
        const ids = await crs.process.getValue(step.args.ids, context, process, item);

    }

    static async update(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const index = await crs.process.getValue(step.args.indexes, context, process, item);
        const id = await crs.process.getValue(step.args.id, context, process, item);
        const changes = await crs.process.getValue(step.args.changes, context, process, item);

    }

    static async update_batch(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const batch = await crs.process.getValue(step.args.batch, context, process, item);

    }

    static async get(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const index = await crs.process.getValue(step.args.indexes, context, process, item);
        const id = await crs.process.getValue(step.args.id, context, process, item);

        if (index != null) {
            return globalThis.dataManagers[manager].getIndex(index);
        }

        return globalThis.dataManagers[manager].getId(id);
    }

    static async get_page(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const from = await crs.process.getValue(step.args.from, context, process, item);
        const to = await crs.process.getValue(step.args.to, context, process, item);
    }

    static async get_all(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        return globalThis.dataManagers[manager].getAll();
    }
}

crs.intent.data_manager = DataManagerStore;