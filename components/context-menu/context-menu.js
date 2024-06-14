import "./../filter-header/filter-header.js";
import {buildElements} from "./utils/build-elements.js";
import {handleSelection, setFocusState} from "./utils/select-item-handler.js";
import {KeyboardInputManager} from "./utils/keyboard-input-manager.js";

/**
 * @class ContextMenu - A context menu component that can be used to display a list of options.
 * This can either be a flat list or a nested list.
 * You should not be using this component directly but instead use the context_menu process api action instead.
 */
class ContextMenu extends crsbinding.classes.BindableElement {
    #options;
    #point;
    #at;
    #anchor;
    #target;
    #clickHandler = this.#click.bind(this);
    #context;
    #process;
    #item;
    #margin;
    #templates;
    #filtering;
    #filterCloseHandler = this.#filterClose.bind(this);
    #filterHeader;
    #keyboardInputManager;
    #isHierarchical = false;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
        await this.init();
    }

    async preLoad() {
        await crsbinding.translations.add(globalThis.translations.contextMenu, "contextMenu");
    }

    /**
     * @method init - Initializes the context menu.
     * @returns {Promise<unknown>}
     */
    async init() {
        return new Promise(async (resolve) => {
            requestAnimationFrame(async () => {
                globalThis.addEventListener("click", this.#clickHandler);
                await this.#buildContextMenu()

                let at = "right";
                let anchor = "top";

                if (this.#target) {
                    at = "bottom";
                    anchor = "right";
                }

                await this.#setFixedLayout(at, anchor);
                await this.#setFilterState();

                await crs.call("component", "notify_ready", {element: this});

                //set focus on the first element
                this.#keyboardInputManager = new KeyboardInputManager(this, this.#options, this.#filterHeader);
                const filterInput = this.#filterHeader.shadowRoot.querySelector("#input-filter");
                await setFocusState(filterInput);
                resolve();
            })
        });
    }

    /**
     * @method disconnectedCallback - Cleans up the context menu when it is removed from the DOM.
     * @returns {Promise<void>}
     */
    async disconnectedCallback() {
        await crs.call("dom_interactive", "disable_resize", {
            element: this.popup
        });

        if (this.#filtering !== false) {
            this.#filterHeader.removeEventListener("close", this.#filterCloseHandler);
        }

        globalThis.removeEventListener("click", this.#clickHandler);
        this.#filtering = null;
        this.#filterHeader = null;
        this.#filterCloseHandler = null;
        this.#clickHandler = null;
        this.#options = null;
        this.#point = null;
        this.#at = null;
        this.#anchor = null;
        this.#target = null;
        this.#context = null;
        this.#process = null;
        this.#item = null;
        this.#margin = null;
        this.#templates = null;
        this.#isHierarchical = null;
        this.#keyboardInputManager.dispose();
        this.#keyboardInputManager = null;
        this.popup = null;
        this.container = null;
        this.filter = null;
        await super.disconnectedCallback();
    }

    /**
     * @method #click - Handles the click event on the context menu.
     * @param event
     * @returns {Promise<void>}
     */
    async #click(event) {
        let element = event.composedPath()[0];

        if (element.id === "input-filter" || element.dataset.ignoreClick === "true") return;

        if (element.parentElement?.dataset.closable == null) {
            await this.#filterClose();
            return;
        }

        await handleSelection(element, this.#options, this);
        await assertViewportBoundary(element)

    }

    /**
     * @method #filterClose - Closes the context menu.
     * @param event
     * @returns {Promise<void>}
     */
    async #filterClose(event) {
        await crs.call("context_menu", "close");
    }

    /**
     * @method #buildContextMenu - Builds the context menu based on the options passed to the component.
     * @returns {Promise<void>}
     */
    async #buildContextMenu() {
        this.#isHierarchical = await buildElements.call(this, this.#options, this.#templates, this.#context, this.container);

        if (this.#isHierarchical === false) {
            await crs.call("dom_interactive", "enable_resize", {
                element: this.popup,
                resize_query: "#resize",
                options: {}
            });
        }
    }

    /**
     * @method #setFixedLayout - Sets the fixed layout for the context menu.
     * @param at {String}- The position of the context menu relative to the point. (top, bottom, left, right)
     * @param anchor {String} - The position of the point relative to the context menu. (top, bottom, left, right)
     * @returns {Promise<void>}
     */
    async #setFixedLayout( at, anchor) {
        const ul = this.shadowRoot.querySelector(".popup");

        await crs.call("fixed_layout", "set", {
            element: ul,
            target: this.#target,
            point: this.#point,
            at: this.#at || at,
            anchor: this.#anchor || anchor,
            margin: this.#margin || 0
        })
    }

    /**
     * @method #setFilterState - Sets the filter state for the context menu.
     * @returns {Promise<void>}
     */
    async #setFilterState() {
        this.#filterHeader = this.shadowRoot.querySelector("filter-header");
        if (this.#filtering !== false) {
            this.#filterHeader.addEventListener("close", this.#filterCloseHandler);
        } else {
            this.#filterHeader.parentElement.removeChild(this.#filterHeader);
        }
    }

    /**
     * @method setOptions - Sets the options for the context menu.
     * This is used by the action system to pass information to the context menu that it needs to render the content.
     * @param args {Object} - The options for the context menu.
     * @param args.options {Array} - An array of options to display in the context menu.
     * @param [args.point] {Object} - The point to position the context menu at.
     * @param [args.at] {String} - The position of the context menu relative to the point. (top, bottom, left, right)
     * @param [args.anchor] {String} - The position of the point relative to the context menu. (top, bottom, left, right)
     * @param [args.target] {HTMLElement} - The target element to position the context menu relative to.
     * @param [args.context] {Object} - The context to use when inflating the context menu. used to execute a process with the menu item.
     * @param [args.process] {String} - The process to call when an option is selected. used to execute a process with the menu item.
     * @param [args.item] {Object} - The item to pass to the process when an option is selected. used to execute a process with the menu item.
     * @param [args.margin] {Number} - The margin to use when positioning the context menu.
     * @param [args.templates] {Object} - The templates to use when rendering the context menu.
     * @param [args.filtering] {Object} - When set to false, disables filtering on the options and the rendering of the filter header.
     * @param [args.height] {String} - The default height of the context menu.
     * @param [args.style] {Object} - The style to apply to the context menu.
     *
     * Relative to a component:
     * - set target to the component
     * - set at to the location of the context menu relative to the component
     * - set anchor to the align the menu to the component. for example if align is "top" the top of the component and the top of the menu will be the same.
     * - set margin to the distance between the component and the menu.
     *
     * Relative to a point:
     * - set point to the point to position the menu at.
     */
    setOptions(args) {
        this.#options = args.options;
        this.#point = args.point;
        this.#at = args.at;
        this.#anchor = args.anchor;
        this.#target = args.target;
        this.#context = args.context;
        this.#process = args.process;
        this.#item = args.item;
        this.#margin = args.margin;
        this.#templates = args.templates;
        this.#filtering = args.filtering ?? true;

        if (typeof args.height == "number") {
            args.height = `${args.height}px`
        }

        this.style.setProperty("--height", args.height);

        if (args.style != null) {
            for (const key of Object.keys(args.style)) {
                this.style.setProperty(key, args.style[key]);
            }
        }
    }
}

customElements.define("context-menu", ContextMenu);

async function assertViewportBoundary(li) {
    if (li.getAttribute("aria-expanded") !== "true") return;

    const ul = li.querySelector(".submenu");
    const { left, width, height,top, bottom } = ul.getBoundingClientRect();

    // sets the first element in the submenu/ul to be focused when the submenu/ul is opened
    await setFocusState(ul.firstChild);

    //Checks if the available space is less than the width of the submenu/ul
    ul.dataset.onEdge = window.innerWidth - left < width;

    //Checks if the available space is less than the height of the submenu/ul and repositions the submenu/ul
    const hasExceededViewportBottomEdge = window.innerHeight - top > height;
    if (hasExceededViewportBottomEdge === false){
        const parentUl = ul.parentElement.parentElement;
        const parentUlBottom = parentUl.getBoundingClientRect().bottom;

        ul.style.top = `${parentUlBottom - bottom}px`;
    }
}