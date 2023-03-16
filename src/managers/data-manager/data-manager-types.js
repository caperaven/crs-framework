import {DataManagerMemoryProvider} from "./data-manager-memory-provider.js";
import {DataManagerIDBProvider} from "./data-manager-idb-provider.js";

export const MANAGER_TYPES = Object.freeze({
    memory: DataManagerMemoryProvider,
    indexdb: DataManagerIDBProvider
});

export const CHANGE_TYPES = Object.freeze({
    add: "add",
    update: "update",
    delete: "delete",
    refresh: "refresh",
    filter: "filter"
});