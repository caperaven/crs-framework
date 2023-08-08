import {
    createOverflowItems,
    showOverflow,
    closeOverflow,
    createOverflowFromCount,
    setPinned
} from "./overflow-utils.js";


/**
 * @class OverflowBar - used to display a list of actions in a dropdown menu that exceeds the width of the component.
 *
 * Parts:
 * - background: div that is displayed screen wide so that you can auto close the overflow menu when clicking outside of it.
 */
export class OverflowBar extends crs.classes.BindableElement {
    #background = null;
    #clickHandler = this.#click.bind(this);
    #dialogOpen = false;
    #isOverflowing = false;

    get background() { return this.#background; }
    set background(value) { this.#background = value; }

    get dialogOpen() { return this.#dialogOpen; }
    set dialogOpen(value) { this.#dialogOpen = value; }

    get isOverflowing() { return this.#isOverflowing; }
    set isOverflowing(value) { this.#isOverflowing = value; }

    get html() { return import.meta.url.replace(".js", ".html"); }
    get shadowDom() { return true; }

    async load() {
        requestAnimationFrame(async () => {
            this.registerEvent(this, "click", this.#clickHandler);
            await this.refresh();
        });
    }

    async #click(event) {
        const target = event.composedPath()[0];

        const action = target.dataset.action;
        const id = target.dataset.id;

        if ((id != null || action != null) && target !== this.btnOverflow) {
            this.notify("execute", { action, id });
        }

        if (target.nodeName === "LI") {
            await setPinned(this, true, action, id, target.textContent, target.dataset.icon);
            await this.refresh();
            return await closeOverflow(this, this.overflow);
        }

        if (this.#dialogOpen) {
            return await closeOverflow(this, this.overflow);
        }

        if (target === this.btnOverflow) {
            return await showOverflow(this, this.btnOverflow, this.overflow);
        }
    }

    /**
     * @method refresh - this function refreshes the overflow menu, redrawing everything to be visible or in overflow
     * @returns {Promise<void>}
     */
    async refresh() {
        const useIcons = this.dataset.display === "icons";

        if (this.dataset.count == null) {
            await createOverflowItems(this, this.btnOverflow, this.overflow, useIcons);
        }
        else {
            await createOverflowFromCount(this, this.btnOverflow, this.overflow, Number(this.dataset.count), useIcons);
        }
    }
}

customElements.define("overflow-bar", OverflowBar);