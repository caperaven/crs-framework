export class SwimLane extends HTMLElement {
    #cardDef = null;
    #header = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const css = `<link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">`;
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = `${css}${html}`;
        await this.load();
    }

    async load() {
        requestAnimationFrame(async () => {
            this.#cardDef = await crs.call("cards_manager", "get", { name: this.dataset.recordCard });

            if (this.#header != null) {
                await this.addHeader();
            }

            await crs.call("component", "notify_ready", { element: this });
        })
    }

    async disconnectedCallback() {
        this.#cardDef = null;
    }

    async addHeader() {
        const header = await crs.call("cards_manager", "get", { name: this.dataset.headerCard });
        const instance = header.template.content.cloneNode(true);
        await header.inflationFn(instance, this.#header);
        this.shadowRoot.querySelector("header").appendChild(instance);
    }

    async setHeader(newValue) {
        this.#header = newValue;

        if (this.dataset.ready != "true") return;

        if (newValue != null) {
            await this.addHeader();
        }
    }

}

customElements.define("swim-lane", SwimLane);