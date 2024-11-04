export default class BlockWidgets extends crsbinding.classes.BindableElement {
    #list;
    #groups;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html")
    }

    async disconnectedCallback() {
        this.#list = null;
    }

    onHTML() {
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = new URL("./block-widgets.css", import.meta.url);

        this.shadowRoot.insertBefore(linkElement, this.shadowRoot.firstChild);
    }

    async load() {
        const data = await crsbinding.events.emitter.emit("getWidgetLibrary");
        const groups = Object.groupBy(data.widgets, ({ category }) => category);
        const template = this.shadowRoot.querySelector("#widget-section");
        const container = this.shadowRoot.querySelector("#widgets-container");

        for (const [key, value] of Object.entries(groups)) {
            const instance = template.content.cloneNode(true);
            instance.querySelector("[role='group']").ariaLabel = key;
            instance.querySelector("h2").textContent = key;
            const ulElement = instance.querySelector("ul");

            for (const item of value) {
                const liElement = document.createElement("li");
                liElement.id = item.id;
                liElement.textContent = item.label;
                liElement.dataset.icon = item.icon;
                liElement.dataset.keywords = item.keywords.join(" ");
                liElement.dataset.widget = "true";
                ulElement.appendChild(liElement);
            }

            container.appendChild(instance);
        }

        this.#list = this.shadowRoot.querySelectorAll("li");
        this.#groups = this.shadowRoot.querySelectorAll('[role="group"]:not(#widgets-container)');
    }

    async search(event) {
        const target = event.composedPath()[0];
        const test = target.value.toLowerCase();
        const words = test.split(" ");

        for (const item of this.#list) {
            for (const word of words) {
                item.hidden = !item.dataset.keywords.includes(test);
            }
        }

        // show / hide the group if it does not have any visible children
        for (const group of this.#groups) {
            const visibleItems = group.querySelectorAll("li:not([hidden])");
            group.hidden = visibleItems.length === 0;
        }
    }
}

customElements.define("block-widgets", BlockWidgets);