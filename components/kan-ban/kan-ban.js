import {addColumnFeatures} from "./columns.js";

export default class KanBan extends crsbinding.classes.BindableElement {
    #columns;
    #refreshHandler;

    get columns() {
        return this.#columns;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.#refreshHandler = this.refresh.bind(this);
        this.#columns = [];
        addColumnFeatures(this);
        await this.#initialDraw();
    }

    async disconnectedCallback() {
        for (const column of this.#columns) {
            column.container = null;
        }

        this.#columns = null;
        await super.disconnectedCallback();
    }

    async #initialDraw() {
        await this.observe_changes();
        await this.refresh();
    }

    async #clear() {
        const items = this.querySelectorAll('[role="cell"]');

        for (let item of items) {
            item.parentElement.removeChild(item);
        }
    }

    async #addInstancesToUI(instances) {
        const value_map = {};

        while (instances.children.length > 0) {
            const child = instances.firstElementChild;
            child.setAttribute("role", "cell");
            const value = child.dataset.value;

            if (value_map[value] == null) {
                value_map[value] = this.#columns.find(item => item[this.dataset.field] == value).container;
            }

            child.parentNode.removeChild(child);
            value_map[value].appendChild(child);
        }
    }

    async #drawAll() {
        const rows = await crs.call("data_manager", "get_all", { manager: this.dataset.manager });

        const instances = crsbinding.inflationManager.get(this.dataset.template, rows);
        await this.#addInstancesToUI(instances);
    }

    async #refresh(args) {
        if (this.#columns.length == 0) return;
        await this.#clear();
        await this.#drawAll();
    }

    async #add(args) {
        const instances = crsbinding.inflationManager.get(this.dataset.template, args.models);
        await this.#addInstancesToUI(instances);
    }

    async #delete(args) {
        const elements = [];
        for (let id of args.ids) {
            const element = this.container.querySelector(`[data-id="${id}"]`);
            if (element != null) {
                elements.push(element);
            }
        }

        for (let element of elements) {
            element.parentElement.removeChild(element);
        }
    }

    async update(args) {
        const element = this.container.querySelector(`[data-id="${args.id}"]`);
        const row = await crs.call("data_manager", "get", { manager: this.dataset.manager, id: args.id })
        crsbinding.inflationManager.get(this.dataset.template, [row], [element]);
    }

    async refresh(args) {
        const action = args?.action || "refresh";
        switch (action) {
            case "refresh": {
                await this.#refresh(args);
                break;
            }
            case "add": {
                await this.#add(args);
                break;
            }
            case "delete": {
                await this.#delete(args);
                break;
            }
            case "update": {
                await this.update(args);
                break;
            }
        }
    }

    async observe_changes() {
        await crs.call("data_manager", "on_change", {
            manager: this.dataset.manager,
            callback: this.#refreshHandler
        })
    }

    async unobserve_changes() {
        await crs.call("data_manager", "remove_change", {
            manager: this.dataset.manager,
            callback: this.#refreshHandler
        })
    }
}


await crs.modules.api("kan_ban", import.meta.url);
customElements.define("kan-ban", KanBan);
