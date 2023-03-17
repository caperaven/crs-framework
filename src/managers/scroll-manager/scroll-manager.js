/**
 * @enum ScrollDirection - what direction is the scroll going.
 * @type {Readonly<{DOWN: string, UP: string, NONE: string}>}
 */
export const ScrollDirection = Object.freeze({
    UP: "up",
    DOWN: "down",
    NONE: "none"
});

/**
 * @class ScrollManager - This class deals with the scroll event on a given element.
 * - It checks for the start of a scroll,
 * - Are you busy with a scroll,
 * - Did you stop scrolling.
 *
 * It executes functions that you passed on as callbacks for those events that you are interested.
 * If those functions are not set then it will only call those that are set.
 *
 * Callback parameters include the
 * - event - the scroll event.
 * - scrollTop - what is the current scroll top.
 * - scrollOffset - what is the size difference between the last scroll event and the current. This also indicates speed.
 * - direction - direction of the scroll, up or down.
 */
export class ScrollManager {
    #element;
    #onStartScroll;
    #onScroll;
    #onEndScroll;
    #scrollHandler = this.#scroll.bind(this);
    #scrollTimerHandler = this.#scrollTimer.bind(this);
    #lastScrollTop = 0;
    #scrollTop = 0;
    #scrollOffset = 0;
    #lastStopScrollTop = 0;
    #timeout = 0;
    #scrolling = false;
    #direction;
    #triggerSize;
    #event;

    /**
     * @constructor
     * @param element {HTMLElement} - The element to listen for scroll events on.
     * @param onStartScroll {function} - The function to call when the scroll starts.
     * @param onScroll {function} - The function to call when the scroll is in progress.
     * @param onEndScroll {function} - The function to call when the scroll ends.
     * @param triggerSize {number} - The number of pixels that need to pass before action is taken.
     */
    constructor(element, onStartScroll, onScroll, onEndScroll, triggerSize) {
        this.#element = element;
        this.#onStartScroll = onStartScroll;
        this.#onScroll = onScroll;
        this.#onEndScroll = onEndScroll;
        this.#triggerSize = triggerSize || 1;
        this.#scrollHandler = this.#scroll.bind(this);
        this.#element.addEventListener("scroll", this.#scrollHandler);
    }

    /**
     * @method dispose - clean up memory
     */
    dispose() {
        this.#element.removeEventListener("scroll", this.#scrollHandler);
        this.#element = null;
        this.#scrollHandler = null;
        this.#scrollTimerHandler = null;
        this.#onStartScroll = null;
        this.#onScroll = null;
        this.#onEndScroll = null;
        this.#scrolling = null;
        this.#direction = null;
        this.#triggerSize = null;
        this.#scrollTop = null;
        this.#scrollOffset = null;
        this.#event = null;
    }

    /**
     * @method #scroll - The scroll event handler.
     * We try and do the minimum amount of work here.
     * It's primary function is to update the required values for the scrollTimer to use.
     * It also starts the scroll timer when we start the scroll operation
     * @param event
     * @returns {Promise<void>}
     */
    async #scroll(event) {
        this.#event = event;
        this.#scrollTop = this.#element.scrollTop;
        this.#scrollOffset = Math.abs(Math.ceil(this.#lastScrollTop - this.#scrollTop));
        this.#direction = this.#lastScrollTop < this.#scrollTop ? ScrollDirection.DOWN : ScrollDirection.UP;

        if (this.#scrolling !== true) {
            this.#scrolling = true;

            if (this.#onStartScroll) {
                this.#onStartScroll(event, this.#scrollTop, this.#scrollOffset, ScrollDirection.NONE);
            }

            this.#scrollTimerHandler();
        }
    }

    /**
     * @method #scrollTimer - This is the main loop during scrolling operations.
     * It is responsible to check if the scroll has stopped.
     * If it has then it will call the onEndScroll callback.
     * If it has not then it will call the onScroll callback.
     * This is a recursive function that will call itself until the scroll has stopped.
     * @returns {Promise<void>}
     */
    async #scrollTimer() {
        requestAnimationFrame(async () => {
            if (this.#lastScrollTop === this.#scrollTop) {
                if (this.#onEndScroll) {
                    await this.#onEndScroll(this.#event, this.#scrollTop, this.#scrollOffset, this.#direction);
                }
                this.#scrolling = false;
                return;
            }

            if (this.#onScroll) {
                await this.#onScroll(this.#event, this.#scrollTop, this.#scrollOffset, this.#direction);
            }

            this.#lastScrollTop = this.#scrollTop;
            this.#scrollTimerHandler();
        })
    }
}