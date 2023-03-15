import {SizeManager} from "./size-manager.js";

export class VirtualizationManager {
    #sizeManager;
    #scrollHandler = this.#scroll.bind(this);
    #element;
    #itemTemplate;
    #inflationFn;
    #timeout;

    #rowMap = {};
    #topIndex = 0;
    #nextDownTrigger = 0;
    #bottomIndex = 0;
    #nextUpTrigger = 0;
    #virtualSize = 5;
    #oldScrollTop = 0;

    /**
     * @constructor
     * @param element {HTMLElement} - The element to enable virtualization on.
     * @param itemTemplate {HTMLTemplateElement} - The template to use for each item.
     * @param inflationFn {function} - The function to call when an item is inflated.
     * @param itemCount {number} - The number of items.
     * @param itemSize {number} - The size of each item.
     */
    constructor(element, itemTemplate, inflationFn, itemCount, itemSize) {
        this.#element = element;
        this.#itemTemplate = itemTemplate;
        this.#inflationFn = inflationFn;

        const bounds = this.#element.getBoundingClientRect();

        this.#sizeManager = new SizeManager(itemSize, itemCount, bounds.height);
        this.#element.addEventListener("scroll", this.#scrollHandler);

        this.#initialize();
    }

    dispose() {
        for (const key of Object.keys(this.#rowMap)) {
            this.#rowMap[key] = null;
        }

        this.#rowMap = null;

        this.#sizeManager = this.#sizeManager.dispose();
        this.#element.removeEventListener("scroll", this.#scrollHandler);
        this.#element = null;
        this.#itemTemplate = null;
        this.#scrollHandler = null;
        this.#inflationFn = null;
    }

    /**
     * @private
     * @method #initialize - create resources required for the virtualization to work.
     * That includes the element that will be used for the virtualization.
     */
    #initialize() {
        this.#element.style.position = "relative";
        this.#element.style.overflow = "auto";

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
        const childCount = this.#sizeManager.pageItemCount * 2;

        for (let i = 0; i < childCount; i++) {
            const top = i * this.#sizeManager.itemSize;
            const clone = this.#itemTemplate.content.cloneNode(true);
            const element = clone.firstElementChild;
            element.style.position = "absolute";
            element.style.top = "px";
            element.style.right = "8px";
            element.style.left = "8px";
            element.textContent = `Item ${i}`;
            element.style.willChange = "translate";

            this.#setTop(element, top);
            fragment.appendChild(clone);
        }

        this.#element.appendChild(fragment);
        this.#initializeRowMap();

        this.#topIndex = 0;
        this.#nextDownTrigger = this.#virtualSize;

        this.#bottomIndex = childCount -1;
        this.#nextUpTrigger = -this.#virtualSize;
    }

    #initializeRowMap() {
        for (let i = 0; i < this.#element.children.length; i++) {
            this.#rowMap[i] = this.#element.children[i];
        }
    }

    #setTop(element, top) {
        element.style.transform = `translate(0, ${top}px)`;
        element.dataset.top = top;
    }

    /**
     * @private
     * @method #scroll - Handles the scroll event.
     */
    #scroll(event) {
        clearTimeout(this.#timeout);

        // check the next trigger and if the top element based on the topIndex is greater than the trigger
        // then move the items above that index down using translate.
        // think about moving elements in an array, the array is 1:1 with the data and the elements for the rows bring rendered.
        // when the user scrolls down, the top element is removed from the array and the bottom element is added to the array.

        const scrollTop = this.#element.scrollTop;
        const dataIndex = this.#sizeManager.getDataIndex(scrollTop);

        if (this.#oldScrollTop < scrollTop) {
            this.#scrollDown(scrollTop);
        }
        else {
            this.#scrollUp(scrollTop);
        }

        this.#oldScrollTop = scrollTop;
    }

    #scrollDown(scrollTop) {
        this.#timeout = setTimeout(() => {
            const topIndex = Math.ceil(scrollTop / this.#sizeManager.itemSize);

            if (topIndex >= this.#nextDownTrigger) {
                // used for inflation

                for (let i = this.#topIndex; i < topIndex; i++) {
                    const element = this.#rowMap[i];
                    const nextIndex = this.#bottomIndex += 1;
                    const nextTop = nextIndex * this.#sizeManager.itemSize;

                    if (nextTop > this.#sizeManager.contentHeight) {
                        this.#bottomIndex = this.#sizeManager.itemCount;
                        return;
                    }

                    this.#setTop(element, nextTop);
                    this.#rowMap[nextIndex] = element;
                    delete this.#rowMap[i];

                    this.#topIndex += 1;
                    this.#nextUpTrigger += 1;
                    this.#nextDownTrigger += 1;
                }
            }
        }, 0);
    }

    #scrollUp(scrollTop) {
        this.#timeout = setTimeout(() => {
            const topIndex = Math.ceil(scrollTop / this.#sizeManager.itemSize);

            if (topIndex <= this.#topIndex) {
                const lastIndex = this.#bottomIndex - this.#virtualSize;

                for (let i = this.#bottomIndex; i > lastIndex; i--) {
                    const element = this.#rowMap[i];
                    const nextIndex = this.#topIndex -= 1;
                    const nextTop = nextIndex * this.#sizeManager.itemSize;

                    if (nextIndex < 0) {
                        this.#topIndex = 0;
                        return;
                    }

                    this.#setTop(element, nextTop);
                    this.#rowMap[nextIndex] = element;
                    delete this.#rowMap[i];

                    this.#bottomIndex -= 1;
                    this.#nextUpTrigger -= 1;
                    this.#nextDownTrigger -= 1;
                }
            }
        }, 0)
    }

    debug() {
        console.log("component debug");
        console.log("top index", this.#topIndex);
        console.log("bottom index", this.#bottomIndex);
        console.log("down trigger", this.#nextDownTrigger);
        console.log("up trigger", this.#nextUpTrigger);
        console.table(this.#rowMap);
    }
}