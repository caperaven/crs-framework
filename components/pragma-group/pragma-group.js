class PragmaGroup extends HTMLElement {
    constructor() {
        super();
        // this.expanded = "true";
    }

    connectedCallback() {
        if (this._initialized == null) {
            this.initTemplate();
            this.setGroupTitle();
            this.setToggleButton();
            this._initialized = true;
            if (this.expanded === undefined) this.expanded = "true";
        } else if (this._initialized == true) {
            this.setToggleButton();
        }
    }

    disconnectedCallback() {
        if (this.toggleHandler != null) {
            this.toggleButtonElement.removeEventListener('click', this.toggleHandler);
            this.toggleHandler = null;
        }
        if (this.keyupHandler != null) {
            this.toggleButtonElement.removeEventListener("keyup", this.keyupHandler);
            this.keyupHandler = null;
        }
        this.toggleButtonElement = null;
        this.body = null;
    }

    static get observedAttributes() {
        return ["expanded","title"]; // array of string for attributes changing ["attribute1"]
    }

    get expanded() {
        return this.getAttribute("expanded") || this._expanded;
    }

    set expanded(newValue) {
        this._expanded = newValue;
        if (newValue == "false") {
            this.classList.add("pragma-group-hidden");
            this.toggleButtonElement != null && this.toggleButtonElement.setAttribute("aria-expanded", "false");
        } else {
            this.classList.remove("pragma-group-hidden");
            this.toggleButtonElement != null && this.toggleButtonElement.setAttribute("aria-expanded", "true")
        }
    }

    get path() {
        return this._path;
    }

    set path(newValue) {
        this._path = newValue;
    }

    get title() {
        return this._title || this.getAttribute("title");
    }

    set title(newValue) {
        if (this._title !== newValue) {
            this._title = newValue;
            this.setGroupTitle();
        }
    }

    get uiGraph() {
        return this._uiGraph;
    }

    set uiGraph(newValue) {
        this._uiGraph = newValue;
    }

    get uiState() {
        return this._uiState;
    }

    set uiState(newValue) {
        this._uiState = newValue;
        if (this._uiGraph != null && this.path != null) {
            this._uiGraph.setChildrenStateForPath(this.path, newValue);
        }
    }

    /**
     * Key up function to handle group expand/collapse toggle with up/down arrow keys
     * @param {event} event - event that get's past containing the key that was pressed
     * @private
     */
    _keyup(event) {
        if (event.key === "ArrowUp" && this.expanded == "true") {
            this.toggleGroup();
        } else if (event.key === "ArrowDown" && this.expanded == "false") {
            this.toggleGroup();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }

    initTemplate() {
        const instance = document.importNode(window.templates.get("pragma-group"), true);
        const disableToggle = this.getAttribute("disable-toggle");
        if (Boolean(disableToggle) === true) {
            const node = instance.querySelector(".pragma-group-expand-button");
            node.parentNode.removeChild(node);
        }
        this.attachShadow({mode: 'open'}).appendChild(instance.cloneNode(true));
        this.body = this.querySelector("[slot='body']");
        this.setGroupTitle();
    }

    setGroupTitle() {
        if(this.shadowRoot == null) {
            return;
        }
        const h3Element = this.shadowRoot.querySelector("h3");
        if (h3Element != null) {
            h3Element.innerText = this.title;
            this.setAttribute("title", this.title);
        }
    }

    setToggleButton() {
        this.toggleButtonElement = this.shadowRoot.querySelector(".pragma-group-expand-button");
        if (this.toggleButtonElement != null) {
            this.toggleHandler = this.toggleGroup.bind(this);
            this.keyupHandler = this._keyup.bind(this);
            this.toggleButtonElement.addEventListener("click", this.toggleHandler);
            this.toggleButtonElement.addEventListener("keyup", this.keyupHandler)
            this.toggleButtonElement.setAttribute("aria-label", this.title);
            this.expanded != null && this.toggleButtonElement.setAttribute("aria-expanded", this.expanded);
        }
    }

    /**
     * Sets attributes on elements when it is expanded/collapsed
     */
    toggleGroup() {
        if (this.expanded == "false") {
            this.setAttribute("expanded", "true");
            this.body?.classList.remove("hidden")
        } else {
            this.setAttribute("expanded", "false");
            this.body?.classList.add("hidden")
        }
    }
}

customElements.define('pragma-group', PragmaGroup);