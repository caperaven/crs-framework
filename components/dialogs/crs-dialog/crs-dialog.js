class CRSDialog extends crs.classes.BindableElement {
    #canCloseCallback;
    #pinned;
    #canPin = true;
    #translateBackup = null;

    get pinned() {
        return this.#pinned;
    }

    set pinned(value) {
        this.#pinned = value;
    }

    get canPin() {
        return this.#canPin;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async disconnectedCallback() {
        crs.binding.utils.unmarkElement(this, true);
        this.#canCloseCallback = null;
        this.#translateBackup = null;
        this.#canPin = null;
        this.#pinned = null;

        if (this.__modal != null) {
            this.__modal.remove();
            this.__modal = null;
        }

        super.disconnectedCallback();
    }

    async #canMove(canMove) {
        const method = canMove ? "enable_move" : "disable_move";

        await crs.call("dom_interactive", method, {
            element: this,
            move_query: '[slot="header"]'
        });
    }

    /**
     * @method initialize
     * @param content {object} - The header, main and footer of the dialog
     * @param options {object} - The options for the dialog
     * @param context {object} - The binding context
     * @returns {Promise<void>}
     */
    initialize(content, options, context) {
        return new Promise(resolve => {
            if (options?.modal !== false) {
                this.classList.add("modal");
            }

            if (content.header != null) {
                content.header.setAttribute("slot", "header");
                this.appendChild(content.header);
            }

            if (content.body != null) {
                content.body.setAttribute("slot", "body");
                this.appendChild(content.body);
            }

            if (content.footer != null) {
                content.footer.setAttribute("slot", "footer");
                this.appendChild(content.footer);
            }

            requestAnimationFrame(async () => {
                await this.#canMove(true);

                if (context != null) {
                    await crs.binding.parsers.parseElements(this.children, context);
                    await crs.binding.data.updateUI(context.bid, null);
                }

                this.style.top = "50%";
                this.style.left = "50%";
                this.style.translate = "-50% -50%";

                if (options?.transform != null) {
                    const x = options.transform.x;
                    const y = options.transform.y;
                    const width = options.transform.width;
                    const height = options.transform.height;

                    this.style.top = 0;
                    this.style.left = 0;
                    this.style.translate = `${x}px ${y}px`;
                    this.style.width = `${width}px`;
                    this.style.height = `${height}px`;
                }

                this.style.opacity = "1";

                resolve();
            })
        });
    }

    /**
     * @method canClose - check if the dialog can be closed
     * For example if you have changes that are not saved you should not be able to close it.
     * @returns {Promise<boolean>}
     */
    async canClose() {
        // fill this out so that you can add this via a callback

        return true;
    }

    async close() {
        await crs.call("dialogs", "close", { id: this.id })
    }

    async toggleFullscreen(event) {
        const btnResize = event.composedPath()[0];
        this.classList.toggle("fullscreen");

        const icon = this.classList.contains("fullscreen") ? "close-fullscreen" : "open-fullscreen";
        btnResize.textContent = icon;

        const canMove = this.classList.contains("fullscreen") ? false : true;
        await this.#canMove(canMove);

        if (canMove == false) {
            this.#translateBackup = this.style.translate;
            this.style.translate = null;
        }
        else {
            if (this.#translateBackup == "-50% -50%") {
                this.style.left = "50%";
                this.style.top = "50%";
            }

            this.style.translate = this.#translateBackup;
            this.#translateBackup = null;

        }
    }
}

customElements.define("crs-dialog", CRSDialog);