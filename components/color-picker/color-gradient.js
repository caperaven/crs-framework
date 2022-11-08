class ColorGradient extends HTMLCanvasElement {
    async connectedCallback() {
        requestAnimationFrame(() => {
            const style = getComputedStyle(this);
            this.width = Number(style.width.replace("px", ""));
            this.height = Number(style.height.replace("px", ""));
            this.#fillGradient();
        })
    }

    #fillGradient() {
        const ctx = this.getContext('2d');
        ctx.rect(0, 0, this.width, this.height);
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
        ctx.fillStyle = gradient;
        ctx.fill();

        console.log()
    }
}

customElements.define("color-gradient", ColorGradient, {extends: "canvas"});