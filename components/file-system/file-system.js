export default class FileSystem extends crsbinding.classes.BindableElement {
    #data;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async load() {
        const tplFolder = this.shadowRoot.querySelector("#tplFolder");
        const tplFile = this.shadowRoot.querySelector("#tplFile");
        await crsbinding.inflationManager.register("file-system-folder", tplFolder);
        await crsbinding.inflationManager.register("file-system-file", tplFile);
    }

    async disconnectedCallback() {
        await crsbinding.inflationManager.unregister("file-system-folder");
        await crsbinding.inflationManager.unregister("file-system-file");
        await super.disconnectedCallback();
    }

    #setPath(array, root) {
        for (const item of array) {
            if (item.kind === "directory") {
                item.path = root.length == 0 ? item.name : `${root}/${item.name}`;
            }
        }
    }

    async selectFolder() {
        this.#data = await crs.call("fs", "open_folder", {});

        this.#setPath(this.#data, "");

        const ul = this.shadowRoot.querySelector("ul");
        ul.innerHTML = "";

        const children = await this.generateFragment(this.#data);
        await ul.appendChild(children);
    }

    async generateFragment(data) {
        const folders = [];
        const files = [];

        for (const item of data) {
            if (item.type == "file") {
                files.push(item)
            }
            else {
                folders.push(item);
            }
        }

        sortArray(folders);
        sortArray(files);

        const fragment = document.createDocumentFragment();

        buildUI(folders, fragment, "file-system-folder", 0);
        buildUI(files, fragment, "file-system-files", 0);

        return fragment;
    }

    async #expandFolder(element) {
        const index = Number(element.dataset.index);

        const handle = null;
        await crs.call("fs", "open_folder", { handle });
    }

    async #loadFile(element) {

    }

    async dblclick(event) {
        const element = event.composedPath()[0];

        if (element.nodeName == "UL") return;

        if (element.dataset.type === "directory") {
            return await this.#expandFolder(element);
        }

        await this.#loadFile(element);
    }
}

function sortArray(array) {
    array.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
}

function buildUI(array, fragment, key, index) {
    const items = crsbinding.inflationManager.get(key, array);

    while (items?.firstElementChild) {
        const element = items.firstElementChild.cloneNode(true);
        element.dataset.index = index;

        fragment.appendChild(element);
        items.removeChild(items.firstElementChild);
    }
}

customElements.define("file-system", FileSystem)