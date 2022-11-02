class ColorPanel extends HTMLCanvasElement {
    #rgba;
    #ctx;

    static get observedAttributes() { return ["value"]; }

    async connectedCallback() {
        this.#rgba = "rgba(255,0,0,1)";
        this.#ctx = this.getContext('2d');
        this.#fillGradient();
    }

    async disconnectedCallback() {
        this.#rgba = null;
        this.#ctx = null;
    }

    #fillGradient() {
        this.#ctx.fillStyle = this.#rgba;
        this.#ctx.fillRect(0, 0, this.width, this.height);

        const white = this.#ctx.createLinearGradient(0, 0, this.width, 0);
        white.addColorStop(0, 'rgba(255,255,255,1)');
        white.addColorStop(1, 'rgba(255,255,255,0)');
        this.#ctx.fillStyle = white;
        this.#ctx.fillRect(0, 0, this.width, this.height);

        const black = this.#ctx.createLinearGradient(0, 0, 0, this.height);
        black.addColorStop(0, 'rgba(0,0,0,0)');
        black.addColorStop(1, 'rgba(0,0,0,1)');
        this.#ctx.fillStyle = black;
        this.#ctx.fillRect(0, 0, this.width, this.height);
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        const rgb = await crs.call("colors", "hex_to_rgb", {hex: newValue});
        this.#rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
        this.#fillGradient();
    }
}

customElements.define("color-panel", ColorPanel, {extends: "canvas"});