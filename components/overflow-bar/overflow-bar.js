export class OverflowBar extends crs.classes.BindableElement {
    #background = null;
    #clickHandler = this.#click.bind(this);
    #dialogOpen = false;

    get html() { return import.meta.url.replace(".js", ".html"); }
    get shadowDom() { return true; }

    constructor() {
        super();
        this.style.visibility = "hidden";
    }

    async load() {
        requestAnimationFrame(() => {
            this.registerEvent(this, "click", this.#clickHandler);
            this.#createOverflowItems();
            this.style.visibility = "visible";
        });
    }

    async #click(event) {
        const target = event.composedPath()[0];

        if (this.#dialogOpen) {
            return await this.#closeOverflow();
        }

        if (target === this.btnOverflow) {
            return await this.#showOverflow();
        }

        const action = target.dataset.action;
        const id = target.dataset.id;
        this.notify("execute", { action, id });
    }

    async #createOverflowItems() {
        const width = this.offsetWidth;
        let right = 0;

        let hasOverflow = false;
        const children = this.children;
        this.overflow.innerHTML = "";
        this.btnOverflow.setAttribute("aria-hidden", "true");

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (hasOverflow) {
                child.setAttribute("aria-hidden", "true");
                await this.#addItemToOverflow(child);
                continue;
            }

            right += child.offsetWidth;
            if (right > width) {
                await this.#addItemToOverflow(child);
                child.setAttribute("aria-hidden", "true");
                hasOverflow = true;
            }
        }

        if (hasOverflow) {
            this.btnOverflow.removeAttribute("aria-hidden");
        }
    }

    async #addItemToOverflow(item) {
        await crs.call("dom", "create_element", {
            tag_name: "li", parent: this.overflow,
            text_content: item.textContent,
            dataset: {
                id: item.dataset.id,
                action: item.dataset.action || "",
                icon: item.dataset.icon || ""
            }
        })
    }

    async #showRelative() {
        this.#background = await crs.call("dom", "create_element", {
            tag_name: "div", parent: this,
            styles: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "transparent",
            }
        })

        this.overflow.style.opacity = 0;
        this.overflow.removeAttribute("aria-hidden");

        await crs.call("fixed_layout", "set", {
            target: this.btnOverflow,
            element: this.overflow,
            at: "bottom",
            anchor: "right"
        });

        requestAnimationFrame(() => {
            this.overflow.style.opacity = 1;
        })
    }

    async #showFullscreen() {
        this.overflow.style.position = "fixed";
        this.overflow.style.top = 0;
        this.overflow.style.left = 0;
        this.overflow.style.right = 0;
        this.overflow.style.bottom = 0;
        this.overflow.removeAttribute("aria-hidden");
    }

    async #showOverflow() {
        const isMobile = await crs.call("system", "is_mobile", {});

        if (isMobile === true) {
            await this.#showFullscreen();
        }
        else {
            await this.#showRelative();
        }

        this.#dialogOpen = true;
    }

    async #closeOverflow() {
        this.#background?.remove();
        this.#background = null;

        this.overflow.setAttribute("aria-hidden", "true");

        this.#dialogOpen = false;
    }

}

customElements.define("overflow-bar", OverflowBar);