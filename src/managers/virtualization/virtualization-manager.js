import {SizeManager} from "./size-manager.js";
import {InflationManager} from "./inflation-manager.js";
import {ScrollManager} from "../scroll-manager/scroll-manager.js";

export class VirtualizationManager {
    #sizeManager;
    #element;
    #itemTemplate;
    #rowMap = {};
    #topIndex = 0;
    #bottomIndex = 0;
    #virtualSize = 0;
    #inflationManager;
    #scrollManager;

    /**
     * @constructor
     * @param element {HTMLElement} - The element to enable virtualization on.
     * @param itemTemplate {HTMLTemplateElement} - The template to use for each item.
     * @param inflationFn {function} - The function to call when an item is inflated.
     * @param dataManager {string} - The data manager to use.
     * @param itemCount {number} - The number of items.
     * @param itemSize {number} - The size of each item.
     */
    constructor(element, itemTemplate, inflationFn, dataManager, itemSize) {
        this.#element = element;
        this.#itemTemplate = itemTemplate;
        this.#inflationManager = new InflationManager(dataManager, inflationFn);

        const bounds = this.#element.getBoundingClientRect();

        crs.call("data_manager", "record_count", {manager: dataManager}).then((itemCount) => {
            this.#sizeManager = new SizeManager(itemSize, itemCount, bounds.height);
            this.#virtualSize = Math.floor(this.#sizeManager.pageItemCount / 2);

            this.#scrollManager = new ScrollManager(
                this.#element,
                null,
                this.#onScroll.bind(this),
                this.#onEndScroll.bind(this),
                this.#sizeManager.itemSize);

            this.#initialize();
        })
    }

    dispose() {
        for (const key of Object.keys(this.#rowMap)) {
            this.#rowMap[key] = null;
        }
        this.#sizeManager = this.#sizeManager.dispose();
        this.#scrollManager = this.#scrollManager.dispose();

        this.#rowMap = null;
        this.#element = null;
        this.#itemTemplate = null;
        this.#topIndex = null;
        this.#bottomIndex = null;
        this.#virtualSize = null;
    }

    /**
     * @private
     * @method #initialize - create resources required for the virtualization to work.
     * That includes the element that will be used for the virtualization.
     */
    #initialize() {
        this.#element.style.position = "relative";
        this.#element.style.overflowY = "auto";
        this.#element.style.willChange = "transform";

        this.#createItems();
        this.#createMarker();
    }

    /**
     * @private
     * @method #createMarker - Creates the marker element that will be used to determine the scroll position.
     */
    #createMarker() {
        const marker = document.createElement("div");
        marker.id = "marker";
        marker.style.height = `1px`;
        marker.style.width = "1px";
        marker.style.position = "absolute";
        marker.style.top = "0";
        marker.style.left = "0";
        marker.style.translate = `${0}px ${this.#sizeManager.contentHeight}px`;
        this.#element.appendChild(marker);
    }

    /**
     * @private
     * @method #createItems - Creates the items that will be used for the virtualization.
     */
    #createItems() {
        const fragment = document.createDocumentFragment();
        const childCount = this.#sizeManager.pageItemCount + (this.#virtualSize * 2);

        // half of virtualize elements at the top and half at the bottom.
        for (let i = -this.#virtualSize; i < childCount - this.#virtualSize; i++) {
            const top = i * this.#sizeManager.itemSize;
            const clone = this.#itemTemplate.content.cloneNode(true);
            const element = clone.firstElementChild;
            element.style.position = "absolute";
            element.style.top = "0";
            element.style.right = "4px";
            element.style.left = "4px";
            element.style.willChange = "translate";

            if (i >= 0) {
                this.#inflationManager.inflate(element, i);
            }

            this.#setTop(element, top);
            fragment.appendChild(clone);
        }

        this.#element.appendChild(fragment);
        this.#initializeRowMap();

        this.#topIndex = -this.#virtualSize;
        this.#bottomIndex = childCount - 1 - this.#virtualSize;
    }

    #initializeRowMap() {
        for (let i = 0; i < this.#element.children.length; i++) {
            const index = -this.#virtualSize + i;
            this.#rowMap[index] = this.#element.children[i];
        }
    }

    #setTop(element, top) {
        if (top >= this.#sizeManager.contentHeight) {
            top = -this.#sizeManager.itemSize * 2;
        }

        element.style.transform = `translate(0, ${top}px)`;
        element.dataset.top = top;
    }

    async #onScroll(event, scrollTop, scrollOffset, direction) {
        const itemsScrolled = Math.floor(scrollOffset / this.#sizeManager.itemSize);
        const topIndex = Math.floor(scrollTop / this.#sizeManager.itemSize);

        if (itemsScrolled <= this.#virtualSize) {
            if (direction === "down") {
                await this.#onScrollDown(topIndex, itemsScrolled);
            } else {
                await this.#onScrollUp(topIndex, itemsScrolled);
            }
        }
        else {
            // if you scroll fast you can jump hundreds of records.
            // in that case the normal virtualization does not work.
            // instead you need to reset from the top down again
            await this.#onSyncPage(topIndex);
        }
    }

    async #onSyncPage(topIndex) {
        console.log("reset top: ", topIndex);
    }

    async #onScrollDown(scrollTopIndex) {
        const count = scrollTopIndex - this.#topIndex;
        const toMove = count - this.#virtualSize;

        const startIndex = this.#topIndex;
        const endIndex = startIndex + toMove;

        for (let i = startIndex; i < endIndex; i++) {
            const element = this.#rowMap[i];
            const newIndex = this.#bottomIndex + 1;

            await this.#scrollPropertiesUpdate(element, newIndex, i, 1);
        }
    }

    async #onScrollUp(scrollTopIndex) {
        const count = scrollTopIndex - this.#topIndex;
        const toMove = Math.abs(count - this.#virtualSize);

        const startIndex = this.#bottomIndex;
        const endIndex = startIndex - toMove;

        for (let i = startIndex; i > endIndex; i--) {
            const element = this.#rowMap[i];
            const newIndex = this.#topIndex - 1;

            if (newIndex < 0) {
                return;
            }

            await this.#scrollPropertiesUpdate(element, newIndex, i, -1);
        }
    }

    async #scrollPropertiesUpdate(element, newIndex, dataIndex, indexOffset) {
        this.#rowMap[newIndex] = element;
        delete this.#rowMap[dataIndex];

        if (newIndex <= this.#sizeManager.itemCount) {
            this.#setTop(element, newIndex * this.#sizeManager.itemSize);
            await this.#inflationManager.inflate(element, newIndex);
        }

        this.#bottomIndex += indexOffset;
        this.#topIndex += indexOffset;
    }

    async #onEndScroll(event, scrollTop, scrollOffset, direction) {
        console.log("done")
    }

    debug() {
        console.log("component debug");
        console.log("top index", this.#topIndex);
        console.log("bottom index", this.#bottomIndex);
        console.log(this.#rowMap);
    }
}