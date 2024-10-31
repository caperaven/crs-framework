export default class BlockWidgets extends crsbinding.classes.BindableElement {
    #list;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html")
    }

    async disconnectedCallback() {
        this.#list = null;
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
                liElement.textContent = item.label;
                liElement.dataset.icon = item.icon;
                liElement.dataset.keywords = item.keywords.join(" ");
                ulElement.appendChild(liElement);
            }

            container.appendChild(instance);
        }

        this.#list = this.shadowRoot.querySelectorAll("li");
    }

    async search(event) {
        const target = event.composedPath()[0];
        const test = target.value.toLowerCase();
        const words = test.split(" ");

        for (const item of this.#list) {
            for (const word of words) {
                item.style.display = item.dataset.keywords.includes(test) ? "" : "none";
            }
        }
    }
}

customElements.define("block-widgets", BlockWidgets);