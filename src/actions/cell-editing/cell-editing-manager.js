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
        document.addEventListener("click", this.#clickHandler, { capture: true, composed: true });
        document.addEventListener("dblclick", this.#dblclickHandler, { capture: true, composed: true });
    }

    dispose() {
        document.removeEventListener("keydown", this.#keyDownHandler, { capture: true, composed: true });
        document.removeEventListener("click", this.#clickHandler, { capture: true, composed: true });
        document.removeEventListener("dblclick", this.#dblclickHandler, { capture: true, composed: true });

        crs.binding.utils.disposeProperties(this.#store);
        this.#store = null;
        super.dispose();
    }

    async #startEditing(target) {
        if (target.dataset.datatype == null) {
            await setElementDataType(target);
        }

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
            await setValueOnModel(target);
            return true;
        }

        target.focus();
        return false;
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
            await this.#endEditing(target);
        }

        if (target.dataset.datatype === "number") {
            if (/Digit[0-9]|Numpad[0-9]|NumpadDecimal|Comma|Period|Backspace|ArrowRight|ArrowLeft|Tab/.test(event.code) == false) {
                event.preventDefault();
                event.stopPropagation();
            }
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
        const storeItem = this.#store[name];

        if (storeItem != null) {
            delete storeItem["definition"];
            delete storeItem["model"];
            delete storeItem["callback"];
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

async function setValueOnModel(cellElement) {
    const fieldName = cellElement.dataset.field;
    const definitionElement = cellElement.closest("[data-def]");
    const definition = definitionElement.dataset.def;

    const fieldDefinition = await crs.call("cell_editing", "get_field_definition", {
        name: definition,
        field_name: fieldName
    })

    const model = await crs.call("cell_editing", "get_model", {
        name: definition
    });

    let value = cellElement.textContent;

    if (fieldDefinition.dataType === "number") {
        value = Number(value);
    }

    if (fieldDefinition.dataType === "boolean") {
        value = value === "true";
    }

    if (fieldDefinition.dataType === "date") {
        value = new Date(value);
    }

    await crs.binding.utils.setValueOnPath(model, fieldName, value);
}

async function setElementDataType(cellElement) {
    const definitionElement = cellElement.closest("[data-def]");
    const definition = definitionElement.dataset.def;
    const fieldName = cellElement.dataset.field;

    const fieldDefinition = await crs.call("cell_editing", "get_field_definition", {
        name: definition,
        field_name: fieldName
    })

    const dataType = fieldDefinition.dataType || "string";
    cellElement.dataset.datatype = dataType;
}

crs.cellEditing = new CellEditingManager();
