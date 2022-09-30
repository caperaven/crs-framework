class TestComponent extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();

        requestAnimationFrame(() => {
            const nav = this.querySelector("nav");
            nav.classList.add("closed");
        })
    }

    preLoad() {
        this.setProperty("id", "my-menu");
    }

    async menuAction(event) {
        event.target.style.background = "red";
        event.stopPropagation();
    }
}

customElements.define("test-component", TestComponent);