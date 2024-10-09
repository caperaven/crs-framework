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
}