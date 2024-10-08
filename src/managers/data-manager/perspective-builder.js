import {FilterBuilder} from "./filter-builder.js";

export class PerspectiveBuilder {
    #definition;

    constructor(definition) {
        this.#definition = structuredClone(definition || {});

        if (this.#definition.filter != null) {
            const filter = this.#definition.filter;
            this.#definition.filter = [];
            filterObjToExprCollection(filter, this.#definition.filter);
        }
    }

    build() {
        if (this.#definition.filter != null) {
            if (this.#definition.filter.length === 1) {
                this.#definition.filter = new FilterBuilder(this.#definition.filter[0]).build();
            }
            else {
                const filterExpression = this.#definition.filter.join(" and ");
                this.#definition.filter = new FilterBuilder(filterExpression).build();
            }
        }

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

        this.#definition.filter = [filterObjToExpr(filter)];
        return this;
    }

    appendFilter(...filters) {
        if (filters == null) return this;

        this.#definition.filter ||= [];

        for (let filter of filters) {
            this.#definition.filter.push(filterObjToExpr(filter));
        }

        return this;
    }

    removeFilter(...filters) {
        if (this.#definition.filter == null) return this;

        const filterStrings = filters.map(f => filterObjToExpr(f));

        const newFilter = this.#definition.filter.filter(f => !filterStrings.includes(f));

        if (newFilter.length === 0) {
            delete this.#definition.filter;
        }
        else {
            this.#definition.filter = newFilter;
        }

        return this;
    }

    clearFilter() {
        delete this.#definition.filter;
        return this;
    }
}

function filterObjToExpr(filter) {
    if (typeof filter === "string") return filter;

    return `${filter.field} ${filter.operator} '${filter.value}'`;
}

function filterObjToExprCollection(filter, collection) {
    if (typeof filter === "string") {
        return collection.push(filter);
    }

    if (filter.expressions == null) {
        return collection.push(filterObjToExpr(filter));
    }

    for (let expression of filter.expressions) {
        filterObjToExprCollection(expression, collection);
    }
}