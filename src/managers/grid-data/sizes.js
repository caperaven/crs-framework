export class Sizes {
    #sizes;
    #cumulativeSizes;
    #totalSize;
    #defaultSize;

    get length() {
        return this.#sizes.length;
    }

    get totalSize() {
        return this.#totalSize;
    }

    get defaultSize() {
        return this.#defaultSize;
    }

    constructor(count, defaultSize) {
        this.#defaultSize = defaultSize;
        this.#sizes = new Uint16Array(count);
        this.#cumulativeSizes = new Uint16Array(count);

        let total = 0;
        for (let i = 0; i < count; i++) {
            total += defaultSize;
            this.#sizes[i] = defaultSize;
            this.#cumulativeSizes[i] = total;
        }

        this.#totalSize = total - this.#sizes[count - 1];
    }

    /**
     * Calculate the cumulative sizes from the sizes.
     */
    #recalculateSizes() {
        let total = 0;

        for (let i = 0; i < this.#sizes.length; i++) {
            total += this.#sizes[i];
            this.#cumulativeSizes[i] = total;
        }

        this.#totalSize = total;
    }

    /**
     * Set the sizes for the given indices.
     * This is used when you resize columns or rows.
     * The changes object is a dictionary where the key is the index and the value is the new size.
     *
     * Example:
     * {
     *     2: 20,
     *     3: 30
     * }
     *
     * @param changes {Object} The changes to make.
     */
    setSizes(changes) {
        for (const entry of Object.entries(changes)) {
            const index = parseInt(entry[0]);

            if (index < 0 || index >= this.#sizes.length) {
                throw new Error(`Invalid index: ${index}`);
            }

            this.#sizes[index] = entry[1];
        }

        this.#recalculateSizes();
        return this;
    }

    /**
     * Get the index of the location in the sizes.
     * This is used when you have a px location, and you need to find the index.
     * @param location {number} The location to find the index for.
     * @returns {number} The index of the location.
     */
    getIndex(location) {
        return this.#cumulativeSizes.findIndex(size => location <= size);
    }

    at(index) {
        return this.#sizes[index];
    }

    set(index, value) {
        this.#sizes[index] = value;
        this.#recalculateSizes();
    }

    cumulative(index) {
        return this.#cumulativeSizes[index];
    }

    getVisibleRange(scroll, containerSize) {
        const start = this.getIndex(scroll);
        const end = this.getIndex(scroll + containerSize);

        return {start, end};
    }

    /**
     * todo: for a given scroll index, calculate the page that must be rendered
     * todo: calculate the number of pages from the given sizes
     * todo: calculate the start and end index for a given page
     * todo: manage frozen columns in calculations
     */
}