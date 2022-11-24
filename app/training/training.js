export default class Training extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }
}

class NonShadowComponent extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = "<button id='my-button'>Hello Plain</button>";
    }
}
customElements.define("non-shadow-comp", NonShadowComponent);

class ShadowComponent extends HTMLElement {
    async connectedCallback() {
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = "<button id='my-button'>Hello Shadow</button>";
    }
}
customElements.define("shadow-comp", ShadowComponent);
