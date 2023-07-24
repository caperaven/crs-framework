class CRSDialog extends crs.classes.BindableElement {
    #canCloseCallback;

    #pinned;
    #canPin = true;

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
        super.disconnectedCallback();
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
                if (context != null) {
                    await crs.binding.parsers.parseElements(this.children, context);
                    await crs.binding.data.updateUI(context.bid, null);
                }

                this.style.top = "50%";
                this.style.left = "50%";
                this.style.translate = "-50% -50%";
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

    async toggleFullscreen(event) {
        const btnResize = event.composedPath()[0];
        this.classList.toggle("fullscreen");

        const icon = this.classList.contains("fullscreen") ? "close-fullscreen" : "open-fullscreen";
        btnResize.textContent = icon;

        // const method = this.classList.contains("fullscreen") ? "disable_move" : "enable_move";
        // const popup = this.shadowRoot.querySelector(".popup");
        // await crs.call("dom_interactive", method, {
        //     element: popup,
        //     move_query: "header"
        // });

    }
}

customElements.define("crs-dialog", CRSDialog);