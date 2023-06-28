import {BaseDataManager} from "./data-manager-base.js";

const DB_NAME = "data-manager";

/**
 * @class DataManagerIDBProvider - data manager for IndexedDB provider.
 * All actions are performed in a index db store.
 * @extends BaseDataManager
 */
export class DataManagerIDBProvider extends BaseDataManager {
    #storeName;
    #sessionKey;

    get storeName() {
        return this.#storeName;
    }

    set records(newValue) {
        this.setRecords(newValue).catch(errors => console.error(errors));
    }

    dispose() {
        crs.call("idb", "release_stores", {
            "name": DB_NAME,
            "stores": [this.#storeName]
        }).catch(error => console.error(error));

        super.dispose();
    }

    async setRecords(records) {
        await super.setRecords(records);
        const result = await crs.call("idb", "set", {
            "name": DB_NAME,
            "store": this.#storeName,
            "records": records,
            "clear": true
        });

        this.#storeName = result.data;
        this.#sessionKey = `${DB_NAME}_${this.#storeName}`;
    }

    async append(...record) {
        await crs.call("idb", "set", {
            "name": DB_NAME,
            "store": this.#storeName,
            "records": record,
            "clear": false
        })
    }

    async getAll() {
        return await crs.call("idb", "get_all", {
            "name": DB_NAME,
            "store": this.#storeName
        })
    }

    async getPage(from, to) {
        return await crs.call("idb", "get_batch", {
            "name": DB_NAME,
            "store": this.#storeName,
            "startIndex": from,
            "endIndex": to
        })
    }

    async getByIndex(index) {
        return await crs.call("idb", "get", {
            "name": DB_NAME,
            "store": this.#storeName,
            "indexes": Array.isArray(index) ? index : [index]
        })
    }

    async getById(id) {
        return await crs.call("idb", "get_by_id", {
            "name": DB_NAME,
            "store": this.#storeName,
            "id": id
        })
    }

    async getIds(indexes) {
        const records = await crs.call("idb", "get", {
            "name": DB_NAME,
            "store": this.#storeName,
            "indexes": indexes
        })

        const ids = [];
        for (const record of records) {
            ids.push(record[this.idField]);
        }
    }

    async removeIndexes(indexes) {
        await crs.call("idb", "delete_by_index", {
            "name": DB_NAME,
            "store": this.#storeName,
            "index": indexes
        })
    }

    async removeIds(ids) {
        await crs.call("idb", "delete_by_id", {
            "name": DB_NAME,
            "store": this.#storeName,
            "ids": ids
        })
    }

    async updateIndex(index, changes) {
        await crs.call("idb", "change_by_index", {
            "name": DB_NAME,
            "store": this.#storeName,
            index,
            changes
        })
    }

    async updateId(id, changes) {
        await crs.call("idb", "change_by_id", {
            "name": DB_NAME,
            "store": this.#storeName,
            id,
            changes
        })
    }

    async update(record) {
        await crs.call("idb", "update_by_id", {
            "name": DB_NAME,
            "store": this.#storeName,
            "models": record
        })
    }

    async setSelectedIndexes(indexes, selected) {
        const result = indexes.map(index => {
            return {
                type: "index",
                values: { index, selected }
            };
        });

        sessionStorage.setItem(this.#sessionKey, JSON.stringify(result));
    }

    async setSelectedIds(ids, selected) {
        const indexes = await crs.call("idb", "get_by_id", {
            "name": DB_NAME,
            "store": this.#storeName,
            "ids": ids
        })

        return await this.setSelectedIndexes(indexes, selected);
    }

    async getSelected(isSelected = true) {
        const indexesString = sessionStorage.getItem(this.#sessionKey);
        if (indexesString == null) return [];
        const indexArray = JSON.parse(indexesString);

        const indexes = getSelectedIndexes(indexArray, isSelected, this.count);
        return await crs.call("idb", "get", {
            "name": DB_NAME,
            "store": this.#storeName,
            "indexes": indexes
        })
    }

    async toggleSelectedIndexes() {
        const indexesString = sessionStorage.getItem(this.#sessionKey);
        if (indexesString == null) return;
        const indexArray = JSON.parse(indexesString);

        if (indexArray.type === "all") {
            indexArray.type = "none";
        }
        else if (indexArray.type === "none") {
            indexArray.type = "all";
        }
        else {
            for (const index of indexArray) {
                index.values.selected = !index.values.selected;
            }
        }

        sessionStorage.setItem(this.#sessionKey, JSON.stringify(indexArray));
    }

    async toggleSelectedIds() {
        await this.toggleSelectedIndexes();
    }

    async setSelectedAll(selected) {
        sessionStorage.setItem(this.#sessionKey, JSON.stringify({
            type: selected == true ? "all" : "none"
        }));
    }
}

function getSelectedIndexes(indexArray, isSelected, count) {
    if (indexArray.type === "none" && isSelected === true) return [];
    if (indexArray.type === "all" && isSelected === false) return [];

    if (indexArray.type === "none" && isSelected === false) {
        indexArray.type = "all";
    }

    if (indexArray.type === "all") {
        return Array.from({ length: count }, (_, i) => i);
    }

    let inverseSelection = isSelected === false || indexArray[0].values.selected === false;

    if (indexArray[0].values.selected === false && isSelected === false) {
        inverseSelection = false;
    }

    const flattened = indexArray.map(index => index.values.index);


    if ( inverseSelection == false ) {
        return flattened;
    }
    else {
        const result = [];
        for (let i = 0; i < count; i++) {
            if (flattened.includes(i) == false) {
                result.push(i);
            }
        }

        return result;
    }
}