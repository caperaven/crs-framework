export class OverlayBase {
    #element;

    get element() {
        return this.#element;
    }

    constructor(parentElement, className, cssURL) {
        this.#element = document.createElement("div");
        this.#element.classList.add(className);
        this.#element.appendChild(createLink(cssURL));

        parentElement.appendChild(this.#element);
    }
}

function createLink(cssURL) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssURL;
    return link;
}