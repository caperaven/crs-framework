export class SizeManager {
    #itemSize;
    #itemCount;
    #containerSize;
    #contentHeight;
    #pageItemCount;


    /**
     * @property contentHeight - The height of all the content together.
     * This is used in determining how big the scrollbar should be.
     * @returns {*}
     */
    get contentHeight() {
        return this.#contentHeight;
    }

    /**
     * @property itemCount - The number of items that can fit in the container.
     * This is used in the virtualization to determine how many items to render.
     * @returns {*}
     */
    get pageItemCount() {
        return this.#pageItemCount;
    }

    constructor(itemSize, itemCount, containerSize) {
        this.#itemSize = itemSize;
        this.#itemCount = itemCount;
        this.#containerSize = containerSize;

        this.#contentHeight = this.#itemSize * this.#itemCount;
        this.#pageItemCount = Math.ceil(containerSize / this.#itemSize);
    }

    dispose() {
        this.#itemSize = null;
        this.#itemCount = null;
    }

    /**
     * @method getDataIndex - Returns the index of the data item that is at the top of the container.
     * @param scrollTop {number} - The current scroll position of the container.
     */
    getDataIndex(scrollTop) {
        const result = Math.floor(scrollTop / this.#itemSize);

        if (result > this.#itemCount) {
            return this.#itemCount;
        }

        return result;
    }
}