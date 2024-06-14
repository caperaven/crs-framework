import {handleSelection, setFocusState} from "./select-item-handler.js";

export class KeyboardInputManager {
    #contextMenu;
    #container;
    #keyHandler = this.#keySelection.bind(this);
    #options;
    #filterHeader;
    #actions = Object.freeze({
        "ArrowDown": this.#arrowDown.bind(this),
        "ArrowUp": this.#arrowUp.bind(this),
        "ArrowRight": this.#arrowRight.bind(this),
        "ArrowLeft": this.#arrowLeft.bind(this),
        "Enter": this.#enter.bind(this),
        "Escape": this.#escape.bind(this)
    })

    constructor(contextMenu, options, filterHeader) {
        this.#options = options;
        this.#contextMenu = contextMenu;
        this.#filterHeader = filterHeader;

        this.#container = this.#contextMenu.container;
        this.#contextMenu.addEventListener("keydown", this.#keyHandler);

        const firstElement = this.#container.querySelector("li");
        if (firstElement) {
            firstElement.tabIndex = 0;
        }
    }

    /**
     * @method dispose - Disposes the keyboard input manager.
     */
    dispose() {
        this.#contextMenu.removeEventListener("keydown", this.#keyHandler);
        this.#contextMenu = null;
        this.#container = null;
        this.#keyHandler = null;
        this.#options = null;
        this.#filterHeader = null;
        this.#actions = null;
    }

    /**
     * @method #keySelection - Handles the keyboard input for the context menu.
     * @param event
     * @returns {Promise<void>}
     */
    async #keySelection(event) {
        let key = event.key;
        const element = event.composedPath()[0]
        this.#contextMenu.popup.dataset.keyboard = "true";

        if (key === 'Tab' && event.shiftKey) {
           key = "ArrowLeft";
        }

        if (this.#actions[key] != null) {
            event.preventDefault();
            await this.#actions[key](element);
        }

    }

    /**
     * @method #arrowDown - Handles the arrow down event.
     * @param element - the selected element.
     * @returns {Promise<void>}
     */
    async #arrowDown(element) {
        if (element.id === "input-filter") {
            await setFocusState(this.#container.firstElementChild);
            return;
        }
        await this.#setTabIndex(element, "nextElementSibling");
    }

    /**
     * @method #arrowUp - Handles the arrow up event.
     * @param element - the selected element.
     * @returns {Promise<void>}
     */
    async #arrowUp(element) {
        if (element.id === "input-filter") return;

        await this.#setTabIndex(element, "previousElementSibling");
    }

    /**
     * @method #arrowRight - Handles the arrow right event.
     * @param element - the selected element.
     * @returns {Promise<void>}
     */
    async #arrowRight(element) {
        if (element.matches(".parent-menu-item") === false || element.getAttribute("aria-expanded") === "true") return
        await handleSelection(element, this.#options, this.#contextMenu, this.#filterHeader);
    }

    /**
     * @method #arrowLeft - Handles the arrow left event.
     * @param element - the selected element.
     * @returns {Promise<void>}
     */
    async #arrowLeft(element) {
        const li = element.parentElement?.parentElement;

        if (li == null || li.tagName.toLowerCase() !== "li") return

        li.setAttribute("aria-expanded", "false");
        li.focus();
    }

    /**
     * @method #enter - Handles the enter event.
     * @param element
     * @returns {Promise<void>}
     */
    async #enter(element) {
        await handleSelection(element, this.#options, this.#contextMenu, this.#filterHeader);
    }

    /**
     * @method #escape - Handles the escape event.
     * @returns {Promise<void>}
     */
    async #escape() {
        await crs.call("context_menu", "close");
    }

    /**
     * @method #setTabIndex - Sets the tabindex on the selected element.
     * @param element - the selected element.
     * @param siblingType {String} - the type of sibling to select.
     * @returns {Promise<void>}
     */
    async #setTabIndex(element, siblingType = null) {
        let li = element[siblingType];

        const parentId = element.parentElement.id;
        if (li == null && parentId === "list-container") {
            li = this.#contextMenu.filter.filterInput;
        }
        else if (li == null && parentId !== "list-container") {
            const elementPosition = {
                nextElementSibling: "firstElementChild",
                previousElementSibling: "lastElementChild"
            }[siblingType];

            li = element.parentElement[elementPosition];
        }

        element.tabIndex = -1;
        await setFocusState(li);
    }
}