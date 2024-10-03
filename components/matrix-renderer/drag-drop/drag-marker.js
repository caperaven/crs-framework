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
    #width = 0;
    #height = 0;
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #moveDirection = null;
    #animateHandler = this.#animate.bind(this);

    constructor(matrixRenderer, targetElement, parentElement, oldX, oldY) {
        this.#targetElement = targetElement;
        this.#parentElement = parentElement;
        this.#matrixRenderer = matrixRenderer;

        this.#selectionAABB = Object.freeze(this.#parentElement.getBoundingClientRect());
        this.#width = this.#selectionAABB.width;
        this.#height = this.#selectionAABB.height;

        this.initialize(oldX, oldY);
    }

    initialize(oldX, oldY) {
        this.#oldX = oldX;
        this.#oldY = oldY;
        this.#startAABB = Object.freeze(this.#targetElement.getBoundingClientRect());

        this.#matrixRenderer.addEventListener("mousemove", this.#mouseMoveHandler);
        this.#matrixRenderer.addEventListener("mouseup", this.#mouseUpHandler);
    }

    unload() {
        this.#matrixRenderer.removeEventListener("mousemove", this.#mouseMoveHandler);
        this.#matrixRenderer.removeEventListener("mouseup", this.#mouseUpHandler);

        cancelAnimationFrame(this.#animationId);
        this.#animationId = null;
    }

    dispose() {
        this.unload();
        delete this.#matrixRenderer.selection.toColumn;
        delete this.#matrixRenderer.selection.toRow;
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

        if (this.#moveDirection === MoveDirectionLock.ROW) {
            const x = this.#clientX - this.#oldX;
            this.#width = Math.max(this.#width + x, this.#selectionAABB.width - 2);
            this.#height = this.#selectionAABB.height - 2;
        }
        else {
            const y = this.#clientY - this.#oldY;
            this.#width = this.#selectionAABB.width - 2;
            this.#height = Math.max(this.#height + y, this.#selectionAABB.height - 2);
        }

        this.#parentElement.style.width = `${this.#width}px`;
        this.#parentElement.style.height = `${this.#height}px`;

        this.#oldX = this.#clientX;
        this.#oldY = this.#clientY;

        this.#animationId = requestAnimationFrame(this.#animateHandler);
    }

    #mouseMove(event) {
        this.#clientX = event.clientX;
        this.#clientY = event.clientY;

        if (this.#animationId == null) {
            if (this.#moveDirection != null) {
                return this.#animateHandler();
            }

            const xDiff = Math.abs(this.#oldX - event.clientX);
            const yDiff = Math.abs(this.#oldY - event.clientY);

            // JHR: NOTE: only start the animation once one of these conditions are met
            if (xDiff > 10) {
                this.#moveDirection = MoveDirectionLock.ROW;
                return this.#animateHandler();
            }

            if (yDiff > 10) {
                this.#moveDirection = MoveDirectionLock.COLUMN;
                return this.#animateHandler();
            }
        }

        event.preventDefault();
        event.stopPropagation();
    }

    #mouseUp(event) {
        this.unload();

        this.#matrixRenderer.ignoreSelect = true;

        if (this.#moveDirection === MoveDirectionLock.ROW) {
            this.#mouseUpRow(event);
        }
        else {
            this.#mouseUpColumn(event);
        }

        event.preventDefault();
        event.stopPropagation();
    }

    #mouseUpRow(event) {
        this.#matrixRenderer.selection.toColumn = Math.max(this.#matrixRenderer.getSelectedColumnIndex(event), this.#matrixRenderer.selection.column);
        this.#width = this.#matrixRenderer.columnSizes.sizeBetween(this.#matrixRenderer.selection.column, this.#matrixRenderer.selection.toColumn);
        this.#parentElement.style.width = `${this.#width}px`;

        if (this.#matrixRenderer.selection.toColumn === this.#matrixRenderer.selection.column) {
            this.dispose();
        }
    }

    #mouseUpColumn(event) {
        this.#matrixRenderer.selection.toRow = Math.max(this.#matrixRenderer.getSelectedRowIndex(event), this.#matrixRenderer.selection.row);
        this.#height = this.#matrixRenderer.rowSizes.sizeBetween(this.#matrixRenderer.selection.row, this.#matrixRenderer.selection.toRow);
        this.#parentElement.style.height = `${this.#height}px`;

        if (this.#matrixRenderer.selection.toRow === this.#matrixRenderer.selection.row) {
            this.dispose();
        }
    }
}

export function dragMarker(event, targetElement) {
    if (this._markerDragManager != null) {
        this._markerDragManager.initialize(event.clientX, event.clientY);
        return true;
    }

    const parentElement = targetElement.getRootNode().host;
    this._markerDragManager = new MarkerDragManager(this, targetElement, parentElement, event.clientX, event.clientY);
    return true;
}