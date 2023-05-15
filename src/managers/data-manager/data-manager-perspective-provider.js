import {BaseDataManager} from "./data-manager-base.js";

/**
 * @class DataManagerPerspectiveProvider - This class is used to provide a perspective based data manager.
 * This data manager needs a handle to the data manager that actually contains the data.
 * Most actions are redirected to that data manager though some actions are internally handled.
 * Examples of that would include management of pages.
 *
 * Some considerations
 * 1. What to do when the perspective changes
 * 2. This needs to be updated when the source data manager changes (records added / removed ...)
 */
export class DataManagerPerspectiveProvider extends BaseDataManager {
    #records;
    #manager;
    #perspective;

    get perspective() {
        return this.#perspective;
    }

    set perspective(newValue) {
        this.#perspective = newValue;
    }

    get manager() {
        return this.#manager;
    }

    set manager(newValue) {
        this.#manager = newValue;
    }

    setRecords(records) {
        return globalThis.dataManagers[this.#manager].setRecords(records);
    }

    append(...record) {
        return globalThis.dataManagers[this.#manager].append(...record);
    }

    /**
     * @method getAll - Get all records from the data manager
     * In this case we need to look at what records are in the perspective and then get those records from the source
     * If there is a grouping defined, get all will return the expanded group records including the group item it self.
     */
    getAll() {

    }

    /**
     * @method getPage - Get the page from the perspective and return the records from the source
     * If there is a grouping defined, get page will return the expanded group records including the group item it self.
     * @param from {number} - the start index
     * @param to {number} - the end index
     */
    getPage(from, to) {

    }

    getByIndex(index) {
        return globalThis.dataManagers[this.#manager].getByIndex(index);
    }

    getById(id) {
        return globalThis.dataManagers[this.#manager].getById(id);
    }

    getIds(indexes) {
        return globalThis.dataManagers[this.#manager].getIds(indexes);
    }

    removeIndexes(indexes) {
        return globalThis.dataManagers[this.#manager].removeIndexes(indexes);
    }

    removeIds(ids) {
        return globalThis.dataManagers[this.#manager].removeIds(ids);
    }

    updateIndex(index, changes) {
        return globalThis.dataManagers[this.#manager].updateIndex(index, changes);
    }

    updateId(id, changes) {
        return globalThis.dataManagers[this.#manager].updateId(id, changes);
    }

    setSelectedIndexes(indexes, selected) {
        return globalThis.dataManagers[this.#manager].setSelectedIndexes(indexes, selected);
    }

    setSelectedIds(ids, selected) {
        return globalThis.dataManagers[this.#manager].setSelectedIds(ids, selected);
    }

    getSelected(isSelected = true) {
        return globalThis.dataManagers[this.#manager].getSelected(isSelected);
    }

    toggleSelectedIndexes(indexes) {
        return globalThis.dataManagers[this.#manager].toggleSelectedIndexes(indexes);
    }

    toggleSelectedIds(ids) {
        return globalThis.dataManagers[this.#manager].toggleSelectedIds(ids);
    }

    setSelectedAll(selected) {
        return globalThis.dataManagers[this.#manager].setSelectedAll(selected);
    }

    async perspectiveChanged() {
        console.log("Perspective changed");
    }
}