class BaseDataManager {
    #id;
    #dataField;
    #count;
    #events = [];

    get count() {
        return this.#count;
    }

    get dataField() {
        return this.#dataField;
    }

    get eventCount() {
        return this.#events.length;
    }

    constructor(id, dataField) {
        this.#id = id;
        this.#dataField = dataField;
    }

    dispose() {
        this.#dataField = null;
        this.#events = null;
        this.#count = null;
    }

    setRecords(records) {
        this.#count = records?.length || 0;
    }

    append(count) {
        this.#count = count;
    }

    removeIndexes(count) {
        this.#count = count;
    }

    removeIds(count) {
        this.#count = count;
    }

    beginTransaction() {
        return null;
    }

    commit() {
        return null;
    }

    addChangeCallback(callback) {
        const index = this.#events.indexOf(callback);
        if (index == -1) {
            this.#events.push(callback);
        }
    }

    removeChangeCallback(callback) {
        const index = this.#events.indexOf(callback);

        if (index != -1) {
            this.#events.splice(index, 1);
        }
    }

    async notifyChanges(args) {
        args.managerId = this.#id;
        for (let event of this.#events) {
            await event(args);
        }
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

    getPage(from, to) {
        return this.#records.slice(from, to);
    }

    getByIndex(index) {
        return this.#records[index];
    }

    getById(id) {
        return this.#records.find(item => item[this.dataField] == id);
    }

    getIds(indexes) {
        const ids = [];
        for (const index of indexes) {
            ids.push(this.#records[index][this.dataField]);
        }
        return ids;
    }

    removeIndexes(indexes) {
        indexes.sort((a, b) => a > b ? -1 : 1);
        const ids = [];

        for (const index of indexes) {
            ids.push(this.#records[index][this.dataField]);
            this.#records.splice(index, 1);
        }

        super.removeIndexes(this.#records.length);
        return {indexes, ids};
    }

    removeIds(ids) {
        const indexes = [];
        for (const id of ids) {
            const index = this.#records.findIndex(item => item[this.dataField] == id);
            indexes.push(index);
            this.#records.splice(index, 1);
        }

        indexes.sort((a, b) => a > b ? -1 : 1);
        super.removeIds(this.#records.length);
        return {indexes, ids};
    }

    updateIndex(index, changes) {
        const record = this.#records[index];
        const id = record[this.dataField];

        const keys = Object.keys(changes);
        for (const key of keys) {
            record[key] = changes[key];
        }

        return {id, index, changes};
    }

    updateId(id, changes) {
        const index = this.#records.findIndex(item => item[this.dataField] == id);
        const record = this.#records[index];

        const keys = Object.keys(changes);
        for (const key of keys) {
            record[key] = changes[key];
        }

        return {id, index, changes};
    }
}

class IndexDBDataManager extends BaseDataManager {
    setRecords(records) {
        super.setRecords(records);
    }
}

const MANAGER_TYPES = Object.freeze({
    memory: MemoryDataManager,
    indexdb: IndexDBDataManager
});

const CHANGE_TYPES = Object.freeze({
    add: "add",
    update: "update",
    delete: "delete",
    refresh: "refresh"
});

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
            globalThis.dataManagers[manager] = new MANAGER_TYPES[type](manager, dataField);
        }

        globalThis.dataManagers[manager].setRecords(records);
        return globalThis.dataManagers[manager];
    }

    static async dispose(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        globalThis.dataManagers[manager].dispose();
        delete globalThis.dataManagers[manager];
    }

    static async set_records(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const records = await crs.process.getValue(step.args.records || [], context, process, item);

        const dataManager = globalThis.dataManagers[manager];
        dataManager.setRecords(records);
        await dataManager.notifyChanges({
            action: CHANGE_TYPES.refresh,
            count: dataManager.count
        })
    }

    static async append(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const records = await crs.process.getValue(step.args.records || [], context, process, item);

        const dataManager = globalThis.dataManagers[manager];
        const index = dataManager.count;
        dataManager.append(...records);

        await dataManager.notifyChanges({
            action: CHANGE_TYPES.add,
            models: records,
            index: index,
            count: records.length
        });
    }

    static async remove(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const indexes = await crs.process.getValue(step.args.indexes, context, process, item);
        const ids = await crs.process.getValue(step.args.ids, context, process, item);

        const dataManager = globalThis.dataManagers[manager];
        let result;

        if (indexes != null) {
            result = dataManager.removeIndexes(indexes);
        }
        else {
            result = dataManager.removeIds(ids);
        }

        await dataManager.notifyChanges({
            action: CHANGE_TYPES.delete,
            indexes: result.indexes,
            ids: result.ids
        })
    }

    static async update(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const index = await crs.process.getValue(step.args.index, context, process, item);
        const id = await crs.process.getValue(step.args.id, context, process, item);
        const changes = await crs.process.getValue(step.args.changes, context, process, item);

        const dataManager = globalThis.dataManagers[manager];

        let result;
        if (index != null) {
            result = dataManager.updateIndex(index, changes);
        }
        else {
            result = dataManager.updateId(id, changes);
        }

        await dataManager.notifyChanges({
            action: CHANGE_TYPES.update,
            id: result.id,
            index: result.index,
            changes: result.changes
        })
    }

    static async update_batch(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const batch = await crs.process.getValue(step.args.batch, context, process, item);
        const dataManager = globalThis.dataManagers[manager];

        dataManager.beginTransaction();
        for (let item of batch) {
            let result;
            if (item.index != null) {
                result = dataManager.updateIndex(item.index, item.changes);
            }
            else {
                result = dataManager.updateId(item.id, item.changes);
            }

            await dataManager.notifyChanges({
                action: CHANGE_TYPES.update,
                index: result.index,
                id: result.id,
                model: dataManager.getByIndex(result.index)
            })
        }
        dataManager.commit();
    }

    static async get(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const index = await crs.process.getValue(step.args.index, context, process, item);
        const id = await crs.process.getValue(step.args.id, context, process, item);

        if (index != null) {
            return globalThis.dataManagers[manager].getByIndex(index);
        }

        return globalThis.dataManagers[manager].getById(id);
    }

    static async get_page(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const from = await crs.process.getValue(step.args.from, context, process, item);
        const to = await crs.process.getValue(step.args.to, context, process, item);

        return globalThis.dataManagers[manager].getPage(from, to);
    }

    static async get_all(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        return globalThis.dataManagers[manager].getAll();
    }

    static async get_ids(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const indexes = await crs.process.getValue(step.args.indexes, context, process, item);

        return globalThis.dataManagers[manager].getIds(indexes);
    }

    static async on_change(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);

        return globalThis.dataManagers[manager].addChangeCallback(callback);
    }

    static async remove_change(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);

        return globalThis.dataManagers[manager].removeChangeCallback(callback);
    }
}

crs.intent.data_manager = DataManagerStore;