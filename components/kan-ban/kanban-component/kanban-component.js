import "./../cards-manager/cards-manager-actions.js";

export class KanbanComponent extends HTMLElement {

    #headerInflateFn;
    #recordInflateFn;
    #cardHeaderName;
    #cardRecordName;

    get headerInflateFn() {
        return this.#headerInflateFn;
    }

    set headerInflateFn(newValue) {
        this.#headerInflateFn = newValue;
    }

    get recordInflateFn() {
        return this.#recordInflateFn;
    }

    set recordInflateFn(newValue) {
        this.#recordInflateFn = newValue;
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async connectedCallback() {
        await this.#loadTemplates();
        const css = `<link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">`;
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.shadowRoot.innerHTML = `${css}${html}`;
        await this.load();
    }

    async #loadTemplates() {
        const headerTemplate = this.querySelector("#tplHeader");
        const recordTemplate = this.querySelector("#tplRecord");
        this.#cardHeaderName = `${this.id}-header`;
        this.#cardRecordName = `${this.id}-record`;

        await crs.call("cards_manager", "register", {
            name: this.#cardHeaderName,
            template: headerTemplate,
            inflationFn: this.headerInflateFn
        })

        await crs.call("cards_manager", "register", {
            name: this.#cardRecordName,
            template: recordTemplate,
            inflationFn: this.recordInflateFn
        });
    }

    async load() {
        requestAnimationFrame(async () => {
            await crs.call("component", "notify_ready", { element: this });
        });
    }

    async disconnectedCallback() {
        await crs.call("cards_manager", "unregister", {
            name: this.#cardHeaderName
        })

        await crs.call("cards_manager", "unregister", {
            name: this.#cardRecordName
        });

        this.#headerInflateFn = null;
        this.#recordInflateFn = null;
        this.#cardHeaderName = null;
        this.#cardRecordName = null;
    }
}

customElements.define("kanban-component", KanbanComponent);