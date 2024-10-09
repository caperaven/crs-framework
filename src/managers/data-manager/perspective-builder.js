export class PerspectiveBuilder {
    #definition;

    constructor(definition) {
        this.#definition = structuredClone(definition || {});
    }

    build() {
        return Object.freeze(this.#definition);
    }

    /**
     * Set the sort definition for the perspective.
     * Sort direction defaults to ascending (asc)
     * @param sort {Array} - array of field names and directions
     * @example setSort(["field1:asc", "field2:dec"])
     */
    setSort(sort) {
        if ((sort || []).length === 0) return this;

        this.#definition.sort = sort;
        return this;
    }

    /**
     * Clear the sort definition from the perspective.
     * @returns {PerspectiveBuilder}
     */
    clearSort() {
        delete this.#definition.sort;
        return this;
    }

    /**
     * Append sort definition to the perspective.
     * The sort items will be appended to the existing sort definition.
     */
    appendSort(...sort) {
        this.#definition.sort ||= [];
        this.#definition.sort.push(...sort);
        return this;
    }

    /**
     * Remove sort definition from the perspective.
     * The sort items will be removed from the existing sort definition.
     */
    removeSort(...args) {
        if (this.#definition.sort == null) return this;

        const newSort = this.#definition.sort.filter(sort => !args.includes(sort));

        // if there are no items left, delete the sort definition
        if (newSort.length === 0) {
            delete this.#definition.sort;
        }
        else {
            this.#definition.sort = newSort;
        }

        return this;
    }

    /**
     * Set the group definition for the perspective
     * @param group {Array} - array of field names
     * @returns {PerspectiveBuilder}
     */
    setGroup(group) {
        if ((group || []).length === 0) return this;

        this.#definition.group = group;
        return this;
    }

    /**
     * Clear the group definition from the perspective.
     * @returns {PerspectiveBuilder}
     */
    clearGroup() {
        delete this.#definition.group;
        return this;
    }

    /**
     * Append group definition to the perspective
     * @param group
     * @returns {PerspectiveBuilder}
     */
    appendGroup(...group) {
        this.#definition.group ||= [];
        this.#definition.group.push(...group);
        return this;
    }

    /**
     * Remove group definition from the perspective
     * @param group
     * @returns {PerspectiveBuilder}
     */
    removeGroup(...group) {
        if (this.#definition.group == null) return this;

        const newGroup = this.#definition.group.filter(g => !group.includes(g));

        if (newGroup.length === 0) {
            delete this.#definition.group;
        }
        else {
            this.#definition.group = newGroup;
        }

        return this;
    }

    setFuzzyFilter(fuzzyFilter) {
        this.#definition.fuzzyFilter = fuzzyFilter ?? "";

        if (this.#definition.fuzzyFilter.trim().length === 0) {
            delete this.#definition.fuzzyFilter;
        }

        return this;
    }

    clearFuzzyFilter() {
        delete this.#definition.fuzzyFilter;
        return this;
    }

    setFilter(filter) {
        if (filter == null) {
            delete this.#definition.filter;
            return this;
        }

        this.#definition.filter = filter;
        return this;
    }

    clearFilter() {
        delete this.#definition.filter;
        return this;
    }
}