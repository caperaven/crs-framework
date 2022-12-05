import "./../../components/tab-list/tab-list.js";
import {ItemsFactory} from "./items-factory.js";

export class AvailableSelected extends HTMLElement {
    #clickHandler = this.#clicked.bind(this);
    #tablist;
    #perspectiveElement;
    #data;
    #currentView;

    //This is for testing purposes
    get clickedHandler() {
        return this.#clickHandler;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(this.html).then(result => result.text());
        await this.load();
    }

    async load() {
        requestAnimationFrame( async () => {
            this.shadowRoot.addEventListener("click", this.#clickHandler);
            this.#tablist = this.shadowRoot.querySelector("tab-list");
            this.#currentView = "selected";
            await crsbinding.translations.parseElement(this);
            await crs.call("component", "notify_ready", {element: this});
        })
    }

    async disconnectedCallback() {
        await this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#data = null
        this.#currentView = null;
        this.#tablist = null;
        this.#perspectiveElement = this.#perspectiveElement?.dispose();
    }

    async #clicked(event) {
        const target = event.target;
        if (target.dataset.action != null) {
            this[target.dataset.action] != null && await this[target.dataset.action](event);
        }
    }

    async toggle(event) {
        const li = event.target.parentElement;

        const source = li.getAttribute("class");
        if (source !== this.#currentView) this.#currentView = source;

        const target = source === "available" ? "selected" : "available";
        const value = this.#data[source].find(item => `${item[this.dataset.idField || "id"]}` === `${li.dataset.id}`);

        await crs.call("array", "transfer", {source: this.#data[source], target: this.#data[target], value: value});
        await this.update(this.#data);
    }

    //NOTE KR: this is for demo purposes
    async drag(event) {
        console.log(event.target, event.target.dataset.action);
    }

    //NOTE KR: this is for demo purposes
    async drill(event) {
        console.log(event.target, event.target.dataset.action);
    }

    async update(data) {
        this.#data = data;
        const selectedTemplate = await ItemsFactory.createTemplate(this, this.#currentView, "selected", this.#data);
        const availableTemplate = await ItemsFactory.createTemplate(this, this.#currentView, "available", this.#data);

        const perspectiveElement = document.createElement("perspective-element");
        perspectiveElement.appendChild(selectedTemplate);
        perspectiveElement.appendChild(availableTemplate);
        perspectiveElement.dataset.store = perspectiveElement._dataId;

        if (this.#perspectiveElement != null) {
            this.shadowRoot.removeChild(this.#perspectiveElement);
            this.#perspectiveElement = await this.#perspectiveElement?.dispose();
        }

        this.shadowRoot.appendChild(perspectiveElement);
        this.#perspectiveElement = perspectiveElement;
        this.#tablist.target = this.#perspectiveElement;
    }

    getSelectedItems() {
        return this.#data.selected;
    }
}

customElements.define("available-selected", AvailableSelected);