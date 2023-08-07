/**
 * @class TabSheet - creates a tab sheet.
 * The tabsheet has preset pages. The pages are created based on the page elements.
 * Set the page's data-title and data-id attributes to set the title and id of the page.
 * The id must be unique to for each page on the tabsheet and is used to identify the page.
 *
 * You can call a function makeActive on the tabsheet to make a page active.
 * The id of the page to make active must be passed as a parameter.
 *
 * If a particular tab has an error on it and, you want to prevent the user from navigating away from it,
 * set the tab to invalid by calling the setInvalid method on the tabsheet.
 * The id of the tab to set invalid must be passed as a parameter.
 *
 * @example <caption>Example usage of tab-sheet</caption>
 *
 * <tab-sheet>
 *     <page data-title="Tab 1" data-id="tab1">
 *         <h1>Heading 1</h1>
 *     </page>
 *
 *     <page data-title="Tab 2" data-id="tab2">
 *         <h1>Heading 2</h1>
 *     </page>
 * </tab-sheet>
 */
export class TabSheet extends crs.classes.BindableElement {
    #headerClickHandler = this.#headerClick.bind(this);
    #headerKeyUpHandler = this.#headerKeyUp.bind(this);

    get html() { return import.meta.url.replace(".js", ".html"); }
    get shadowDom() { return true; }

    async load() {
        await this.#createTabs();
        await this.#setDefaultTab();
        this.registerEvent(this.header, "click", this.#headerClickHandler);
        this.registerEvent(this.header, "keyup", this.#headerKeyUpHandler);
    }

    async disconnectedCallback() {
        this.unregisterEvent(this.header, "click", this.#headerClickHandler);
        this.unregisterEvent(this.header, "keyup", this.#headerKeyUpHandler);
        this.#headerClickHandler = null;
        this.#headerKeyUpHandler = null;
        super.disconnectedCallback();
    }

    /**
     * @method #createTabs - creates the tabs based on the page elements.
     * @returns {Promise<void>}
     */
    async #createTabs() {
        const pages = this.querySelectorAll("page");

        const fragment = document.createDocumentFragment();
        for (const page of pages) {
            page.setAttribute("aria-hidden", "true");

            const button = await crs.call("dom", "create_element", {
                tag_name: "tab",
                text_content: page.dataset.title,
                dataset: { id: page.dataset.id },
                attributes: { tabindex: 0 }
            })

            fragment.appendChild(button);
        }
        this.header.appendChild(fragment);
    }

    /**
     * @method #setDefaultTab - sets the default tab based on the default attribute.
     * If the default attribute is not set the first tab will be set as the default.
     * @returns {Promise<void>}
     */
    async #setDefaultTab() {
        const defaultId = this.dataset.default || this.header.firstElementChild.dataset.id;
        await this.makeActive(defaultId);
    }

    /**
     * @method #headerClick - handles the click event on the header.
     * This will make the tab active.
     * @param event
     * @returns {Promise<void>}
     */
    async #headerClick(event) {
        const target = event.composedPath()[0];
        if (target === this.header) return;

        const id = target.dataset.id;

        await this.makeActive(id);
    }

    /**
     * Handle keyboard events on the header.
     * @param event
     * @returns {Promise<void>}
     */
    async #headerKeyUp(event) {
        const highlightedTab = this.#clearHighlight();

        if (event.code === "Enter" || event.code === "Space") {
            const id = highlightedTab.dataset.id;
            return await this.makeActive(id);
        }

        if (event.code === "ArrowRight") {
            const nextTab = highlightedTab.nextElementSibling || this.header.lastElementChild;
            return nextTab.dataset.highlight = true;
        }

        if (event.code === "ArrowLeft") {
            const previousTab = highlightedTab.previousElementSibling || this.header.firstElementChild;
            return previousTab.dataset.highlight = true;
        }
    }

    /**
     * @method #removeOldTabMarkers - removes the old tab markers.
     * This will remove it from the tab and also the page
     * @returns {Promise<boolean>}
     */
    async #removeOldTabMarkers() {
        const currentActiveTab = this.shadowRoot.querySelector("tab[aria-selected='true']");
        if (currentActiveTab != null) {
            const options = { canNavigateAway: true };
            this.notify("before_leave", options);

            if (options.canNavigateAway === false) return false;

            currentActiveTab.removeAttribute("aria-selected");
            const oldId = currentActiveTab.dataset.id;
            this.querySelector(`page[data-id="${oldId}"]`).setAttribute("aria-hidden", "true");
        }
    }

    /**
     * @method #setNewTabMarkers - sets the new tab to active.
     * @param tabId - the id of the tab to set active
     * @returns {Promise<void>}
     */
    async #setNewTabMarkers(tabId) {
        const tab = this.shadowRoot.querySelector(`tab[data-id="${tabId}"]`);
        tab.setAttribute("aria-selected", "true");
        tab.dataset.highlight = true;
        this.querySelector(`page[data-id="${tabId}"]`).removeAttribute("aria-hidden");
        this.notify("after_enter");
    }

    /**
     * @method setInvalid - sets the tab to invalid or invalid state.
     * If the tab has a error mark this as invalid.
     * @param tabId - the id of the tab to set invalid
     * @param value - true or false
     * @returns {Promise<void>}
     */
    async setInvalid(tabId, value) {
        const tab = this.shadowRoot.querySelector(`tab[data-id="${tabId}"]`);
        tab.dataset.invalid = value;
    }

    /**
     * @method makeActive - makes the tab with the given id active.
     * @param tabId - the id of the tab to make active based on the data-id attribute.
     * @returns {Promise<void>}
     */
    async makeActive(tabId) {
        this.#clearHighlight();
        const canMoveAway = await this.#removeOldTabMarkers();
        if (canMoveAway === false) return;

        await this.#setNewTabMarkers(tabId);
    }

    #clearHighlight() {
        const highlightedTab = this.header.querySelector("tab[data-highlight='true']");
        if (highlightedTab != null) {
            delete highlightedTab.dataset.highlight;
        }
        return highlightedTab;
    }
}

customElements.define("tab-sheet", TabSheet);