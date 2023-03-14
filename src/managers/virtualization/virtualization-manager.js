import {SizeManager} from "./size-manager.js";

export class VirtualizationManager {
    #sizeManager;
    #scrollHandler = this.#scroll.bind(this);
    #element;
    #timeout;
    #marker;

    constructor(element, itemCount, itemSize) {
        const bounds = this.#element.getBoundingClientRect();

        this.#sizeManager = new SizeManager(itemSize, itemCount, bounds.height);
        this.#element = element;
        this.#element.addEventListener("scroll", this.#scrollHandler);
    }

    dispose() {
        this.#element.removeEventListener("scroll", this.#scrollHandler);
        this.#sizeManager = this.#sizeManager.dispose();
        this.#scrollHandler = null;
        this.#element = null;

        this.#marker.remove();
        this.#marker = null;
    }

    /**
     * @private
     * @method #initialize - create resources required for the virtualization to work.
     * That includes the element that will be used for the virtualization.
     */
    #initialize() {
        this.#element.style.position = "relative";
        this.#element.style.overflow = "auto";

        this.#marker = document.createElement("div");
        this.#marker.style.height = `1px`;
        this.#marker.style.width = "1px";
        this.#marker.style.position = "absolute";
        this.#marker.style.top = "0";
        this.#marker.style.left = "0";
        this.#marker.style.translate = `${0}px ${this.#sizeManager.contentHeight}px`;
        this.#element.appendChild(this.#marker);
    }

    /**
     * @private
     * @method #scroll - Handles the scroll event.
     */
    #scroll() {
        clearTimeout(this.#timeout);

        this.#timeout = setTimeout(() => {
            const dataIndex = this.#sizeManager.getDataIndex(this.#element.scrollTop);
            console.log(dataIndex);
        }, 500);
    }
}