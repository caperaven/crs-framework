class CellEditingManager extends crs.classes.Observable {
    #store = {};
    #keyDownHandler = this.#keyDown.bind(this);

    constructor() {
        super();
        document.addEventListener("keydown", this.#keyDownHandler, { capture: true, composed: true });
        document.addEventListener("click", async (event) => {console.log(event)}, { capture: true, composed: true, bubbles: true });
    }

    dispose() {
        document.removeEventListener("keydown", this.#keyDownHandler, { capture: true, composed: true });

        crs.binding.utils.disposeProperties(this.#store);
        this.#store = null;
        super.dispose();
    }

    async #startEditing(target) {
        target.__oldValue = target.textContent;
        target.setAttribute("contenteditable", "true");
        setSelectionRange(target);
    }

    async #endEditing(target) {
        delete target.__oldValue;
        target.removeAttribute("contenteditable");
        clearSelectionRange();
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
    }

    async register(name, definition, element, model) {
        this.#store[name] = {
            definition,
            model
        }

        element.dataset.def = name;
        await updateCells(element);
    }

    async unregister(name) {
        if (this.#store[name != null]) {
            delete this.#store["definition"];
            delete this.#store["model"];
        }
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
