import {BaseDataManager} from "./data-manager-base.js";

/**
 * @class DataManagerMemoryProvider - This class is used to provide a memory based data manager.
 * @extends BaseDataManager
 */
export class DataManagerMemoryProvider extends BaseDataManager {
    #records;

    /**
     * @method setRecords - This method is called to set the records in the data manager.
     * @param records
     */
    setRecords(records) {
        this.#records = records;
        super.setRecords(records);
    }

    /**
     * @method append - This method is called to append records to the data manager.
     * @param record
     */
    append(...record) {
        this.#records.push(...record);
        super.append(this.#records.length);
    }

    /**
     * @method getAll - This method is called to get all of the records in the data manager.
     * @returns {*}
     */
    getAll() {
        return this.#records;
    }

    /**
     * @method getPage - This method is called to get a page of records from the data manager.
     * @param from {number} - The index of the first record to get
     * @param to {number} - The index of the last record to get
     * @returns {*}
     */
    getPage(from, to) {
        return this.#records.slice(from, to);
    }

    /**
     * @method getByIndex - This method is called to get a record by its index.
     * @param index {number} - The index of the record to get
     * @returns {*}
     */
    getByIndex(index) {
        return this.#records[index];
    }

    /**
     * @method getById - This method is called to get a record by its id.
     * @param id {number} - The id of the record to get
     * @returns {*}
     */
    getById(id) {
        return this.#records.find(item => item[this.dataField] == id);
    }

    /**
     * @method getIds - This method is called to get the ids of records by their indexes.
     * @param indexes {number[]} - The indexes of the records to get
     * @returns {*[]}
     */
    getIds(indexes) {
        const ids = [];
        for (const index of indexes) {
            ids.push(this.#records[index][this.dataField]);
        }
        return ids;
    }

    /**
     * @method removeIndexes - This method is called to remove records by their indexes.
     * @param indexes {number[]} - The indexes of the records to remove
     * @returns {{indexes, ids: *[]}}
     */
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

    /**
     * @method removeIds - This method is called to remove records by their ids.
     * @param ids {number[]} - The ids of the records to remove
     * @returns {{indexes: *[], ids}}
     */
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

    /**
     * @method updateIndex - This method is called to update a record by its index.
     * @param index {number} - The index of the record to update
     * @param changes {object} - The changes to make to the record
     * @returns {{changes, index, id: *}}
     */
    updateIndex(index, changes) {
        const record = this.#records[index];
        const id = record[this.dataField];

        const keys = Object.keys(changes);
        for (const key of keys) {
            record[key] = changes[key];
        }

        return {id, index, changes};
    }

    /**
     * @method updateId - This method is called to update a record by its id.
     * @param id {number} - The id of the record to update
     * @param changes {object} - The changes to make to the record
     * @returns {{changes, index: *, id}}
     */
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



