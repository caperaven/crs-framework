// https://codepen.io/pizza3/pen/BVzYNP?editors=0010

class ColorGradient extends HTMLCanvasElement {
    async connectedCallback() {
    }

    async disconnectedCallback() {

    }
}

customElements.define("color-gradient", ColorGradient, {extends: "canvas"});