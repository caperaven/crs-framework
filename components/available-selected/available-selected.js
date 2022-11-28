import "./../../components/tab-list/tab-list.js";
import {ItemsFactory} from "./items-factory.js";

export class AvailableSelected extends HTMLElement {
    #clickHandler = this.#clicked.bind(this);
    #tablist;
    #perspectiveElement;
    #data;

    //This is for testing purposes
    get clickedHandler() {
        return this.#clickHandler;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    set data(newValue) {
        this.#data = newValue;
        this.update();
    }

    get data() {
        return this.#data;
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

            if (this.data != null) await this.update("selected");
            await crsbinding.translations.parseElement(this);
        })
    }

    async disconnectedCallback() {
        await this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#tablist = null;
        //TODO KR: do I need to remove data-store info
        this.#perspectiveElement = this.#perspectiveElement?.dispose();
        this.#data = null;
    }

    async update(defaultView) {
        if (this.#perspectiveElement != null) {
            this.shadowRoot.removeChild(this.#perspectiveElement);
            this.#perspectiveElement = await this.#perspectiveElement.dispose();
        }

        const selectedTemplate = await this.#getTemplate("selected");
        const availableTemplate = await this.#getTemplate("available");
        defaultView === "available" ? availableTemplate.setAttribute("data-default", "true") : selectedTemplate.setAttribute("data-default", "true");

        const perspectiveElement = document.createElement("perspective-element");
        perspectiveElement.appendChild(selectedTemplate);
        perspectiveElement.appendChild(availableTemplate);
        this.shadowRoot.appendChild(perspectiveElement);

        this.#perspectiveElement = this.shadowRoot.querySelector("perspective-element");
        this.#tablist.target = this.#perspectiveElement;
    }

    async #getTemplate(collection) {
        const template = document.createElement("template");
        const frag = await ItemsFactory.createElements({
            template_id: collection,
            template: this.querySelector(`[data-id='${collection}']`),
        }, this.data[collection]);
        template.content.appendChild(frag);

        template.setAttribute("data-id", collection);

        return template;
    }

    async #clicked(event) {
        const target = event.target;
        if (target.dataset.action != null) {
            //NOTE KR: check with GM on the following
            // this.dispatchEvent(new CustomEvent(target.dataset.action, {detail: {target: target}}))

            await this.#toggleSelection(event);
        }
    }

    async #toggleSelection(event) {
        const source = event.target.getAttribute("class");
        const target = source === "available" ? "selected" : "available";
        const value = this.data[source].find(item => `${item[this.dataset.idField || "id"]}` === `${event.target.dataset.id}`);

        await crs.call("array", "transfer", {source: this.data[source], target: this.data[target], value: value});
        await this.update(source);
    }
}

customElements.define("available-selected", AvailableSelected);