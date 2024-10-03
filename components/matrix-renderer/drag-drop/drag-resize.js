class ResizeDragManager {
    #targetElement;
    #matrixRenderer;
    #oldX;
    #oldY;
    #clientX = 0;
    #clientY = 0;
    #animationId;
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #animateHandler = this.#animate.bind(this);
    #width = 0;
    #columnIndex = 0;
    #frozenColumnCount = 0;

    constructor(matrixRenderer, targetElement, oldX, oldY) {
        this.#targetElement = targetElement;
        this.#matrixRenderer = matrixRenderer;
        this.#oldX = oldX;
        this.#oldY = oldY;

        this.#columnIndex = Number(targetElement.parentElement.dataset.index);
        this.#width = matrixRenderer.columnSizes.at(this.#columnIndex);
        this.#frozenColumnCount = this.#matrixRenderer.config.frozenColumns?.count ?? 0;

        this.#matrixRenderer.addEventListener("mousemove", this.#mouseMoveHandler);
        this.#matrixRenderer.addEventListener("mouseup", this.#mouseUpHandler);
    }

    dispose() {
        cancelAnimationFrame(this.#animationId);
        this.#matrixRenderer.removeEventListener("mousemove", this.#mouseMoveHandler);
        this.#matrixRenderer.removeEventListener("mouseup", this.#mouseUpHandler);

        this.#targetElement = null;
        this.#matrixRenderer = null;
        this.#oldX = null;
        this.#oldY = null;
        this.#columnIndex = null;
        this.#width = null;

        delete this._resizeDragManager;
    }

    #mouseMove(event) {
        this.#clientX = event.clientX;
        this.#clientY = event.clientY;

        if (this.#animationId == null) {
            const xDiff = Math.abs(this.#oldX - event.clientX);

            if (xDiff > 10) {
                return this.#animateHandler();
            }
        }

        event.preventDefault();
        event.stopPropagation();
    }

    #mouseUp(event) {
        this.#matrixRenderer.calculateGroupSizes();
        this.#matrixRenderer.refresh();
        this.dispose();
        event.preventDefault();
        event.stopPropagation();
    }

    #animate() {
        if (this.#animateHandler == null) {
            return;
        }

        const diffX = this.#clientX - this.#oldX;
        const newWidth = Math.max(this.#width + diffX, 50);

        this.#matrixRenderer.config.columns[this.#columnIndex].width = newWidth;
        this.#matrixRenderer.columnSizes.set(this.#columnIndex, newWidth);
        this.#matrixRenderer.calculateGroupSizes();

        if (this.#columnIndex < this.#frozenColumnCount) {
            this.#matrixRenderer.calculateFrozenDetails();
        }

        this.#matrixRenderer.refresh();

        this.#animationId = requestAnimationFrame(this.#animateHandler);
    }
}

export function dragResize(event, targetElement) {
    this._resizeDragManager = new ResizeDragManager(this, targetElement, event.clientX, event.clientY);
    return true;
}