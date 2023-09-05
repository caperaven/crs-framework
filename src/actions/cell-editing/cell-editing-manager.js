import {validateCell} from "./cell-validation.js";

class CellEditingManager extends crs.classes.Observable {
    #store = {};
    #currentCell = null;
    #keyDownHandler = this.#keyDown.bind(this);
    #clickHandler = this.#click.bind(this);
    #dblclickHandler = this.#dblclick.bind(this);

    constructor() {
        super();
        document.addEventListener("keydown", this.#keyDownHandler, { capture: true, composed: true });
        document.addEventListener("click", this.#clickHandler, { capture: true, composed: true, bubbles: true });
        document.addEventListener("dblclick", this.#dblclickHandler, { capture: true, composed: true, bubbles: true });
    }

    dispose() {
        document.removeEventListener("keydown", this.#keyDownHandler, { capture: true, composed: true });
        document.removeEventListener("click", this.#clickHandler, { capture: true, composed: true, bubbles: true });
        document.removeEventListener("dblclick", this.#dblclickHandler, { capture: true, composed: true, bubbles: true });

        crs.binding.utils.disposeProperties(this.#store);
        this.#store = null;
        super.dispose();
    }

    async #startEditing(target) {
        target.__oldValue = target.textContent;
        target.setAttribute("contenteditable", "true");
        this.#currentCell = target;
        setSelectionRange(target);
    }

    async #endEditing(target) {
        const result = await validateCell(target);

        // if the value is valid then update accordingly.
        if (result === true) {
            this.#currentCell = null;
            delete target.__oldValue;
            target.removeAttribute("contenteditable");
            clearSelectionRange();
            return;
        }

        target.focus();
    }

    async #click(event) {
        if (this.#currentCell != null) {
            await this.#endEditing(this.#currentCell);
        }
    }

    async #dblclick(event) {
        const target = event.composedPath()[0];
        if (target.dataset.field == null || target.dataset.contenteditable == null) return;
        await this.#startEditing(target);
    }

    async #keyDown(event) {
        const target = event.composedPath()[0];

        if (target.dataset.field == null || target.dataset.contenteditable == null) return;

        if (event.code === "Escape") {
            event.preventDefault();
            event.stopPropagation();

            target.textContent = target.__oldValue || "";
            return await this.#endEditing(target);
        }

        if (event.code === "Enter") {
            event.preventDefault();
            event.stopPropagation();

            if (target.getAttribute("contenteditable") == null) {
                await this.#startEditing(target);
            }
            else {
                await this.#endEditing(target);
            }

            return;
        }

        // we need this to overcome event issues with focusout and focusin through shadow dom.
        // when you are tabbing through cells that are on the same shadow root the focusout and focusin events are not fired.
        // since we need to step editing on focus out we need to do it manually.
        if (event.code === "Tab") {
            return await this.#endEditing(target);
        }
    }

    /**
     * @method register - register a cell or group of cells for editing.
     * Pass the top most element that contains the cells.
     * Sometimes that would be a single element or a element with children.
     * @param name {string} - the name of the cell or group of cells.
     * @param definition {object} - the definition of the cell or group of cells.
     * @param element {HTMLElement} - the top most element that contains the cells.
     * @param model {object} - the model that contains the data for the cells.
     * @returns {Promise<void>}
     */
    async register(name, definition, element, model) {
        this.#store[name] = {
            definition,
            model
        }

        element.dataset.def = name;
        await updateCells(element);
    }

    /**
     * @method unregister - unregister a cell or group of cells for editing.
     * @param name {string} - the name of the cell or group of cells.
     * @returns {Promise<void>}
     */
    async unregister(name) {
        if (this.#store[name != null]) {
            delete this.#store["definition"];
            delete this.#store["model"];
        }
    }

    async getDefinition(name) {
        return this.#store[name]?.definition;
    }

    async getFieldDefinition(name, fieldName) {
        const definition = await this.getDefinition(name);
        return definition?.fields[fieldName];
    }

    /**
     * @method getModel - get the model of a cell or group of cells.
     * @param name {string} - the name of the cell or group of cells.
     * @returns {Promise<*>}
     */
    async getModel(name) {
        return this.#store[name]?.model;
    }
}

/**
 * @method updateCells - for all the content editable cells update the HTML as required.
 * @param element
 * @returns {Promise<void>}
 */
async function updateCells(element) {
    // 1. Make all cells tab focusable.
    if (element.matches("[data-contenteditable]")) {
        element.setAttribute("tabindex", "0");
    }

    // 2. Check the children for contenteditable and  make them focusable.
    for (const child of element.querySelectorAll("[data-contenteditable]")) {
        child.setAttribute("tabindex", "0");
    }
}

function clearSelectionRange() {
    const selection = window.getSelection();
    selection.removeAllRanges();
}

function setSelectionRange(target) {
    const range = document.createRange();
    range.selectNodeContents(target);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

crs.cellEditing = new CellEditingManager();
