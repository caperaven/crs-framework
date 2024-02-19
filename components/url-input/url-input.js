export class UrlInput extends HTMLElement {
    #clickOrKeyHandler;
    #urlInputValue;
    #inputHandler;
    #launchBtn;
    #urlInput;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        await this.load();
    }

    async disconnectedCallback() {
        crsbinding.dom.disableEvents(this);

        this.unregisterEvent(this, "input", this.#inputHandler);
        this.unregisterEvent(this, "keydown", this.#clickOrKeyHandler);
        this.unregisterEvent(this.#launchBtn, "click", this.#clickOrKeyHandler);

        this.#urlInput = null;
        this.#launchBtn = null;
        this.#inputHandler = null;
        this.#urlInputValue = null;
        this.#clickOrKeyHandler = null;
    }

    load() {
        return new Promise(async (resolve) => {
            this.#urlInput = this.shadowRoot.querySelector("#url-input");
            const urlInputLabel = this.shadowRoot.querySelector("#url-input-label");
            urlInputLabel.textContent = this.dataset.title;
            await this.#enableEvents();
            resolve();
        });
    }
    #enableEvents() {
        crsbinding.dom.enableEvents(this);

        this.#inputHandler = this.#setButtonState.bind(this);
        this.#clickOrKeyHandler = this.#eventHandler.bind(this);
        this.#launchBtn = this.shadowRoot.querySelector("#launch-url");

        this.registerEvent(this, "input", this.#inputHandler);
        this.registerEvent(this, "keydown", this.#clickOrKeyHandler);
        this.registerEvent(this.#launchBtn, "click", this.#clickOrKeyHandler);
    }

    async #setButtonState(event) {
        this.#urlInputValue = this.#urlInput.value;
        if (this.#urlInputValue?.length <= 0) {
            this.#launchBtn.disabled = true;
            this.#urlInput.classList.remove("invalid-url");
            return;
        }

        this.#launchBtn.disabled = false;
    }

    async #eventHandler(event) {
        if (((event.type === "click" && event.target.id === "launch-url") || event.key === "Enter") && this.#urlInputValue?.length > 0) {
            await this.#launchURL();
        }
        return;
    }

    async #launchURL() {
        const validUrl = await this.#validateURL(this.#urlInputValue);
        if (validUrl === false) return;

        window.open(validUrl, "_blank");
    }

    async #validateURL(url) {
        try {
            url = url.startsWith("www.") && ("https://" + url);
            return new URL(url);

        } catch (error) {
            this.#urlInput.classList.add("invalid-url");
            throw error;
        }
    }
}
customElements.define('url-input', UrlInput);