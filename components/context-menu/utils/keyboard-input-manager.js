import {handleSelection, setTabIndex, setFocusState } from "./select-item-handler.js";

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
        "Enter": this.#enter.bind(this)
    })

    constructor(contextMenu, options,filterHeader) {
        this.#options = options;
        this.#contextMenu = contextMenu;
        this.#filterHeader = filterHeader;

        this.#container = this.#contextMenu.container;
        this.#container.addEventListener("keydown", this.#keyHandler);

        const firstElement = this.#container.querySelector("li");
        if (firstElement) {
            setFocusState(firstElement).then(() => {return;});
        }
    }

    dispose() {
        this.#container.removeEventListener("keydown", this.#keyHandler);
        this.#contextMenu = null;
        this.#container = null;
        this.#keyHandler = null;
        this.#options = null;
        this.#filterHeader = null;
        this.#actions = null;
    }

    async #keySelection(event) {
        const key = event.key;
        const element = event.composedPath()[0]

        if (key === "Escape") {
            await crs.call("context_menu", "close");
            return;
        }

        if (this.#actions[key] != null) {
            event.preventDefault();
            await this.#actions[key](element);
        }
    }

    async #arrowDown(element) {
        await setTabIndex(element, "nextElementSibling");
    }

    async #arrowUp(element) {
        await setTabIndex(element, "previousElementSibling");
    }

    async #arrowRight(element) {
        if (element.matches(".parent-menu-item") === false) return
        await handleSelection(element, this.#options, this.#contextMenu, this.#filterHeader);
    }

    async #arrowLeft(element) {
        const li = element.parentElement.parentElement;

        if (li == null) return

        li.setAttribute("aria-expanded", "false");
        li.focus();
    }

    async #enter(element) {
        await handleSelection(element, this.#options, this.#contextMenu, this.#filterHeader);
    }
}