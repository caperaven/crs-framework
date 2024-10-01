const MoveDirectionLock = Object.freeze({
    ROW: 0,
    COLUMN: 1
})

class MarkerDragManager {
    #animationId;
    #matrixRenderer;
    #targetElement;
    #parentElement;
    #startAABB;
    #selectionAABB;
    #oldX = 0;
    #oldY = 0;
    #clientX = 0;
    #clientY = 0;
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #moveDirection = MoveDirectionLock.COLUMN;
    #animateHandler = this.#animate.bind(this);

    constructor(matrixRenderer, targetElement, parentElement, oldX, oldY) {
        this.#targetElement = targetElement;
        this.#parentElement = parentElement;
        this.#matrixRenderer = matrixRenderer;
        this.#oldX = oldX;
        this.#oldY = oldY;
        this.#matrixRenderer.addEventListener("mousemove", this.#mouseMoveHandler);
        this.#matrixRenderer.addEventListener("mouseup", this.#mouseUpHandler);

        this.#startAABB = this.#targetElement.getBoundingClientRect();
        this.#selectionAABB = this.#parentElement.getBoundingClientRect();
    }

    dispose() {
        cancelAnimationFrame(this.#animationId);
        this.#animateHandler = null;

        this.#matrixRenderer.removeEventListener("mousemove", this.#mouseMoveHandler);
        this.#matrixRenderer.removeEventListener("mouseup", this.#mouseUpHandler);
        delete this.#matrixRenderer._markerDragManager;

        this.#targetElement.style.translate = "";
        this.#targetElement = null;
        this.#parentElement = null;
        this.#matrixRenderer = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;
        this.#startAABB = null;
        this.#selectionAABB = null;
        this.#oldX = null;
        this.#oldY = null;
        this.#clientX = null;
        this.#clientY = null;
        this.#moveDirection = null;

        return null;
    }

    #animate() {
        if (this.#animateHandler == null) {
            return;
        }

        let width = 0;
        let height = 0;

        if (this.#moveDirection === MoveDirectionLock.ROW) {
            const x = this.#clientX - this.#startAABB.left;
            width = Math.max(this.#selectionAABB.width + x, this.#selectionAABB.width - 2);
            height = this.#selectionAABB.height - 2;
        }
        else {
            const y = this.#clientY - this.#startAABB.top;
            width = this.#selectionAABB.width - 2;
            height = Math.max(this.#selectionAABB.height + y, this.#selectionAABB.height - 2);
        }

        this.#parentElement.style.width = `${width}px`;
        this.#parentElement.style.height = `${height}px`;

        this.#animationId = requestAnimationFrame(this.#animateHandler);
    }

    #mouseMove(event) {
        this.#clientX = event.clientX;
        this.#clientY = event.clientY;

        if (this.#animationId == null) {
            const xDiff = Math.abs(this.#oldX - event.clientX);
            const yDiff = Math.abs(this.#oldY - event.clientY);

            if (xDiff > 10) {
                this.#moveDirection = MoveDirectionLock.ROW;
                return this.#animateHandler();
            }

            if (yDiff > 10) {
                this.#moveDirection = MoveDirectionLock.COLUMN;
                return this.#animateHandler();
            }
        }
    }

    #mouseUp(event) {
        this.dispose();
    }
}

export function dragMarker(event, targetElement) {
    const parentElement = targetElement.getRootNode().host;
    this._markerDragManager = new MarkerDragManager(this, targetElement, parentElement, event.clientX, event.clientY);
    return true;
}