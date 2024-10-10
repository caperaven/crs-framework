/**
 * @class TabList - A tab list component that will display a list of tabs and allow the user to select one of them.
 */
export class TabList extends HTMLElement {
    //TODO KR:
    // - Set keyboard interaction NOTE: will be handled by process API
    // - Overflow capabilities
    // - Status icon on tabs
    #clickHandler = this.#clicked.bind(this);
    #target;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    set target(value) {
        this.#target = value;
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();
    }

    async disconnectedCallback() {
        await this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#target = null;
    }

    load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                this.shadowRoot.addEventListener("click", this.#clickHandler);
                await crsbinding.translations.parseElement(this);
                // When the component is loaded, we don't have a target, so we need to find it.

                await this.#setInitialTab();

                await crs.call("component", "notify_ready", {element: this});
                resolve();
            })
        })
    }

    async #setInitialTab() {
        const tab = this.dataset.default;
        const target = this.querySelector(`[data-view="${tab}"]`) || this.querySelector(`[data-view]`);
        await this.#setSelected(tab, target);
    }

    async #clicked(event) {
        const target = event.composedPath()[0];
        const tab = target.dataset.view;
        await crs.call("dom_collection", "toggle_selection", {target});
        await this.#setHiddenState(tab);
        this.dispatchEvent(new CustomEvent("change", {detail: {tab}}));
    }

    async #setSelected(tab, target) {
        await crs.call("dom_collection", "toggle_selection", {target});
        await this.#setHiddenState(tab);
    }

    /**
     * @method #setHiddenState - This method will set the hidden state depending on the tab that is clicked.
     * If the tab is clicked, the tab will be visible, other tabs will be hidden.
     * @param tab {String} - The tab which should be visible.
     * @returns {Promise<void>}
     */
    async #setHiddenState(tab) {
        // we use the this.#target in the case of the element being within a shadowDom of another component
        const target = this.#target || document.querySelector(this.getAttribute("for"));
        const tabs = target.children;
        tab = tab || tabs[0].dataset.id;
        for (const tabContainer of tabs) {
            if (tabContainer.dataset.id === tab) {
                tabContainer.hidden = false;
            } else {
                tabContainer.hidden = true;
            }
        }
    }
}

customElements.define("tab-list", TabList);