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

    async #expandFolder(element) {
        this.dispatchEvent(new CustomEvent("change", { detail: {
            kind: "directory",
            name: element.textContent.split("\n").join("")
        }}));

        if (element.matches('[aria-expanded="true"]')) {
            return await this.#collapseFolder(element);
        }

        element.setAttribute("aria-expanded", "true");

        const level = Number(element.dataset.level);
        const path = element.dataset.path;

        const index = this.#data.findIndex(item => item.path == path);
        const handle = this.#data[index];
        const data = await crs.call("fs", "open_folder", { handle });

        await this.#prefixPaths(data, path);

        const fragment = await this.#generateFragment(data, level + 1)
        element.parentElement.insertBefore(fragment, element.nextElementSibling);
        this.#data.splice(index + 1, 0, ...data);

        element.dataset.count = data.length;
    }

    async #collapseFolder(element) {
        element.setAttribute("aria-expanded", "false");

        const count = Number(element.dataset.count);
        element.dataset.count = 0;

        for (let i = 0; i < count; i++) {
            element.parentElement.removeChild(element.nextElementSibling);
        }

        const index = this.#data.findIndex(item => item.path == element.dataset.path);
        this.#data.splice(index + 1, count);
    }

    async #loadFile(element) {
        const path = element.dataset.path;
        const handle = this.#data.find(item => item.path == path);
        const result = await crs.call("fs", "read_file", { handle });

        this.dispatchEvent(new CustomEvent("change", {
            detail: {
                kind: 'file',
                name: element.textContent.split("\n").join(""),
                content: result
            }
        }))
    }

    async #prefixPaths(data, path) {
        for (const item of data) {
            item.path = `${path}/${item.name}`
        }
    }

    async #generateFragment(data, level = 0) {
        const folders = [];
        const files = [];

        for (const item of data) {
            if (item.kind == "file") {
                files.push(item)
            }
            else {
                folders.push(item);
            }
        }

        sortArray(folders);
        sortArray(files);

        const fragment = document.createDocumentFragment();

        buildUI(folders, fragment, "file-system-folder", level);
        buildUI(files, fragment, "file-system-file", level);

        return fragment;
    }

    /**
     * called externally to start the process when the parent is ready
     * @returns {Promise<void>}
     */
    async selectFolder() {
        this.#data = await crs.call("fs", "open_folder", {});

        this.#setPath(this.#data, "");

        const ul = this.shadowRoot.querySelector("ul");
        ul.innerHTML = "";

        const children = await this.#generateFragment(this.#data);
        await ul.appendChild(children);
    }

    /**
     * called by binding
     */
    async dblclick(event) {
        const element = event.composedPath()[0];

        if (element.nodeName == "UL") return;

        const selected = element.parentElement.querySelector("[aria-selected]");
        selected?.removeAttribute("aria-selected");

        element.setAttribute("aria-selected", "true");

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

function buildUI(array, fragment, key, level) {
    if (array.length == 0) return;

    const items = crsbinding.inflationManager.get(key, array);

    while (items?.firstElementChild) {
        const element = items.firstElementChild.cloneNode(true);
        element.dataset.level = level;
        element.style.marginLeft = `${level * 16}px`;

        fragment.appendChild(element);
        items.removeChild(items.firstElementChild);
    }
}

customElements.define("file-system", FileSystem)