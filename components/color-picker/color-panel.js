// https://codepen.io/pizza3/pen/BVzYNP?editors=0010

class ColorPanel extends HTMLCanvasElement {
    #rgba;
    #ctx;

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

        const grdWhite = this.#ctx.createLinearGradient(0, 0, this.width, 0);
        grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
        grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
        this.#ctx.fillStyle = grdWhite;
        this.#ctx.fillRect(0, 0, this.width, this.height);

        const grdBlack = this.#ctx.createLinearGradient(0, 0, 0, this.height);
        grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
        grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
        this.#ctx.fillStyle = grdBlack;
        this.#ctx.fillRect(0, 0, this.width, this.height);
    }
}

customElements.define("color-panel", ColorPanel, {extends: "canvas"});