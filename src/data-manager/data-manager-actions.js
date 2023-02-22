import {CHANGE_TYPES, MANAGER_TYPES} from "./data-manager-types.js";

/**
 * @class DataManagerActions - This class contains all the actions that can be performed on a data manager.
 * It is the main interface for working with data managers via the process-api
 *
 * Features:
 * - Register a data manager
 * - Dispose a data manager
 * - Set records for a data manager
 * - Append records to a data manager
 * - Remove records from a data manager
 * - Get records from a data manager
 * - Get record by id from a data manager
 * - Get record by index from a data manager
 * - Get ids from a data manager
 * - Get indexes from a data manager
 * - Get count from a data manager
 * - Get page from a data manager
 * - Get all records from a data manager
 * - Get all ids from a data manager
 * - Get all indexes from a data manager
 * - Get all records from a data manager
 */
class DataManagerActions {
    /**
     * @method perform - Perform an action on a data manager. Main interface for working with data managers via the process-api
     * @param step {object} - The step that contains the action to perform
     * @param context {object} - The context of the process
     * @param process {object} - The process
     * @param item {object} - Current item in a process loop
     * @returns {Promise<void>}
     */
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method register - Register a data manager that can be accessed by other UI or process components
     * @param step  {object} - The step that contains the action to perform
     * @param context {object} - The context of the process
     * @param process {object} - The process
     * @param item {object} - Current item in a process loop
     *
     * @param step.args.manager {string} - The name of the data manager. You will use this when performing operations on the data manager.
     * @param step.args.id_field {string} - The name of the field that contains the id of the record. Default is "id"
     * @param step.args.type {string} - The type of data manager to use. Default is "indexdb" but you can also use "memory"
     *
     * @example <caption>javascript example</caption>
     * await crs.call("data_manager", "register" {
     *     manager: "my_data_manager",
     *     id_field: "id",
     *     type: "memory",
     *     records: []
     * });
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "data_manager",
     *     "action": "register",
     *     "args": {
     *         "manager": "my_data_manager",
     *         "id_field": "id",
     *         "type": "memory",
     *         "records": "$context.data.records
     *     }
     * }
     *
     * @returns {Promise<*>}
     */
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

    /**
     * @method dispose - Dispose a data manager that can be accessed by other UI or process components and remove it from the global data manager list
     * @param step {object} - The step that contains the action to perform
     * @param context {object} - The context of the process
     * @param process {object} - The process
     * @param item {object} - Current item in a process loop
     *
     * @param step.args.manager {string} - The name of the data manager. You will use this when performing operations on the data manager.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("data_manager", "dispose" {
     *     manager: "my_data_manager",
     * })
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "data_manager",
     *    "action": "dispose",
     *        "args": {
     *        "manager": "my_data_manager"
     *    }
     * }
     */
    static async dispose(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        globalThis.dataManagers[manager].dispose();
        delete globalThis.dataManagers[manager];
    }

    /**
     * @method record_count - Get the count of records in a data manager
     * @param step {object} - The step that contains the action to perform
     * @param context {object} - The context of the process
     * @param process {object} - The process
     * @param item {object} - Current item in a process loop
     *
     * @param step.args.manager {string} - The name of the data manager. You will use this when performing operations on the data manager.
     * @returns {Promise<void>}
     */
    static async record_count(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return 0;

        const dataManager = globalThis.dataManagers[manager];
        return dataManager.count;
    }


    /**
     * @method set_records - Set records for a data manager
     * @param step
     * @param context
     * @param process
     * @param item
     * @returns {Promise<void>}
     */
    static async set_records(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return;

        const records = await crs.process.getValue(step.args.records || [], context, process, item);

        const dataManager = globalThis.dataManagers[manager];
        dataManager.setRecords(records);
        await dataManager.notifyChanges({
            action: CHANGE_TYPES.refresh,
            count: dataManager.count
        })
    }

    /**
     * @method append - Append records to a data manager
     * @param step {object} - The step that contains the action to perform
     * @param context {object} - The context of the process
     * @param process {object} - The process
     * @param item {object} - Current item in a process loop
     * @param step.args.manager {string} - The name of the data manager. You will use this when performing operations on the data manager.
     * @param step.args.records {array} - The records to append
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("data_manager", "append" {
     *     manager: "my_data_manager",
     *     records: [{id: 1, name: "test"}]
     * })
     */
    static async append(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return;

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

    /**
     * @method remove - Remove records from a data manager
     * @param step {object} - The step that contains the action to perform
     * @param context {object} - The context of the process
     * @param process {object} - The process
     * @param item {object} - Current item in a process loop
     * @param step.args.manager {string} - The name of the data manager. You will use this when performing operations on the data manager.
     * @param [step.args.indexes] {array} - The indexes of the records to remove
     * @param [step.args.ids] {array} - The ids of the records to remove
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example using indexes</caption>
     * await crs.call("data_manager", "remove" {
     *    manager: "my_data_manager",
     *    indexes: [0, 1, 2]
     * });
     *
     * @example <caption>javascript example using ids</caption>
     * await crs.call("data_manager", "remove" {
     *   manager: "my_data_manager",
     *   ids: [1001, 1002, 1003]
     * });
     */
    static async remove(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return;

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

    /**
     * @method update - Update records in a data manager
     * @param step {object} - The step that contains the action to perform
     * @param context {object} - The context of the process
     * @param process {object} - The process
     * @param item {object} - Current item in a process loop
     *
     * @param step.args.manager {string} - The name of the data manager. You will use this when performing operations on the data manager.
     * @param [step.args.index] {number} - The index of the record to update
     * @param [step.args.id] {number} - The id of the record to update
     * @param step.args.changes {object} - The changes to make to the record
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example using index</caption>
     * await crs.call("data_manager", "update" {
     *     manager: "my_data_manager",
     *     index: 0,
     *     changes: {name: "test"}
     * });
     *
     * @example <caption>javascript example using id</caption>
     * await crs.call("data_manager", "update" {
     *    manager: "my_data_manager",
     *    id: 1001,
     *    changes: {name: "test"}
     * });
     */
    static async update(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return;

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
        if (manager == null) return;

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
        if (manager == null) return;

        const index = await crs.process.getValue(step.args.index, context, process, item);
        const id = await crs.process.getValue(step.args.id, context, process, item);

        if (index != null) {
            return globalThis.dataManagers[manager].getByIndex(index);
        }

        if (globalThis.dataManagers[manager] == null) {
            return null;
        }

        return globalThis.dataManagers[manager].getById(id);
    }

    static async get_page(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return;

        const from = await crs.process.getValue(step.args.from, context, process, item);
        const to = await crs.process.getValue(step.args.to, context, process, item);

        if (globalThis.dataManagers[manager] == null) {
            return null;
        }

        return globalThis.dataManagers[manager].getPage(from, to);
    }

    static async get_all(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return;

        if (globalThis.dataManagers[manager] == null) {
            return null;
        }

        return globalThis.dataManagers[manager].getAll();
    }

    static async get_ids(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return;

        const indexes = await crs.process.getValue(step.args.indexes, context, process, item);

        if (globalThis.dataManagers[manager] == null) {
            return null;
        }

        return globalThis.dataManagers[manager].getIds(indexes);
    }

    static async on_change(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return;

        const callback = await crs.process.getValue(step.args.callback, context, process, item);
        return globalThis.dataManagers[manager].addChangeCallback(callback);
    }

    static async remove_change(step, context, process, item) {
        const manager = await crs.process.getValue(step.args.manager, context, process, item);
        if (manager == null) return;

        const callback = await crs.process.getValue(step.args.callback, context, process, item);
        return globalThis.dataManagers[manager].removeChangeCallback(callback);
    }
}

crs.intent.data_manager = DataManagerActions;