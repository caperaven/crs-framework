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
    #lastScrollTop = 0;
    #lastStopScrollTop = 0;
    #timeout = 0;
    #scrolling = false;
    #direction;
    #triggerSize;

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

    dispose() {
        this.#element.removeEventListener("scroll", this.#scrollHandler);
        this.#element = null;
        this.#scrollHandler = null;
        this.#onStartScroll = null;
        this.#onScroll = null;
        this.#onEndScroll = null;
        this.#lastScrollTop = null;
        this.#lastStopScrollTop = null;
        this.#timeout = null;
        this.#scrolling = null;
        this.#direction = null;
        this.#triggerSize = null;
    }

    async #scroll(event) {
        requestAnimationFrame(() => {
            const scrollingTimeout = setTimeout(async () => {
                clearTimeout(scrollingTimeout);
                event.preventDefault();

                const scrollTop = Math.floor(this.#element.scrollTop);
                const scrollOffset = Math.abs(Math.ceil(this.#lastScrollTop - scrollTop));

                if (this.#scrolling !== true) {
                    if (this.#onStartScroll) {
                        await this.#onStartScroll(event, scrollTop, scrollOffset, ScrollDirection.NONE);
                    }

                    this.#scrolling = true;
                    return;
                }

                // we have stopped scrolling
                if (this.#lastStopScrollTop === scrollTop) {
                    if (this.#onEndScroll) {
                        await this.#onEndScroll(event, scrollTop, scrollOffset, this.#direction);
                    }

                    this.#scrolling = false;
                    return;
                }

                // we have not scrolled enough to cause an action
                if (scrollOffset < this.#triggerSize) {
                    this.#lastStopScrollTop = scrollTop;
                    return;
                }

                this.#direction = this.#lastScrollTop < scrollTop ? ScrollDirection.DOWN : ScrollDirection.UP;

                if (this.#onScroll) {
                    await this.#onScroll(event, scrollTop, scrollOffset, this.#direction);
                }

                this.#lastScrollTop = scrollTop;
                this.#lastStopScrollTop = scrollTop;
            }, 16);
        })
    }
}