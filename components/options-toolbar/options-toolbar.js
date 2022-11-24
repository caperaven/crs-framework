class OptionsToolbar extends HTMLElement {
    #bounds;
    #marker;
    #clickHandler;
    #previouslySelected;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.#clickHandler = this.#click.bind(this);
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(() => {
            this.#bounds = this.getBoundingClientRect();
            this.#marker = this.shadowRoot.querySelector(".marker");

            const selectedItem = this.querySelector(`[aria-selected='true']`) ?? this.firstElementChild;
            this.#setSelected(selectedItem, false);
            this.addEventListener("click", this.#clickHandler);

            const timeout = setTimeout(() => {
                this.#marker.style.transition = "translate 0.3s ease-out";
                clearTimeout(timeout);
            }, 0.5)
        })
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#marker = null;
        this.#bounds = null;
        this.#clickHandler = null;
        this.#previouslySelected = null;
    }

    async #setSelected(element, dispatchEvent= true) {
        const bounds = element.getBoundingClientRect();

        this.style.setProperty("--width", `${bounds.width}px`);
        this.style.setProperty("--height", `${bounds.height}px`);
        this.#marker.style.translate = `${bounds.left - this.#bounds.left}px 4px`;

        this.#previouslySelected?.removeAttribute("aria-selected");
        element.setAttribute("aria-selected", true);
        this.dataset.value = element.dataset.value;
        this.#previouslySelected = element;

        if (dispatchEvent === true) {
            this.dispatchEvent(new CustomEvent("change", {detail: element.dataset.value}));
        }
    }

    async #click(event) {
        if (event.target.nodeName == "BUTTON") {
            await this.#setSelected(event.target);
        }
    }
}

customElements.define("options-toolbar", OptionsToolbar);