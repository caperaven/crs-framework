const MoveState =  Object.freeze({
    None: 0,
    AddWidget: 1,
    MoveElement: 2
});

export class DragDropManager {
    #mouseDownHandler = this.#mouseDown.bind(this);
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #state = MoveState.None;
    #dragElement;   // the clone that we see while moving the element.
    #sourceElement; // the element that was interacted with to start the move operation.
    #animateMoveHandler = this.#animateMove.bind(this);
    #startX = 0;
    #startY = 0;
    #x = 0;
    #y = 0;

    constructor() {
        document.addEventListener("mousedown", this.#mouseDownHandler);
    }

    dispose() {
        document.removeEventListener("mousedown", this.#mouseDownHandler);
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;
        this.#state = null;
        this.#animateMoveHandler = null;
        this.#dragElement = null;
        this.#startX = null;
        this.#startY = null;
        this.#x = null;
        this.#y = null;
        return null;
    }

    #animateMove() {
        // animation is no longer required so stop the animation timer.
        if (this.#dragElement == null) return;

        this.#dragElement.style.translate = `${this.#x}px ${this.#y}px`;
        requestAnimationFrame(this.#animateMoveHandler);
    }

    #mouseDown(event) {
        const target = event.composedPath()[0];

        if (isWidget(target)) {
            this.#state = MoveState.AddWidget;
        }
        else if (isMoveableElement(target)) {
            this.#state = MoveState.MoveElement;
        }
        else {
            this.#state = MoveState.None;
            return;
        }

        this.#sourceElement = target;
        this.#startX = event.clientX;
        this.#startY = event.clientY;
        this.#x = event.clientX;
        this.#y = event.clientY;

        document.addEventListener("mousemove", this.#mouseMoveHandler);
        document.addEventListener("mouseup", this.#mouseUpHandler);
    }

    #mouseMove(event) {
        this.#x = Math.round(event.clientX);
        this.#y = Math.round(event.clientY);

        // if we already have a dragElement we just want to update the position
        if (this.#dragElement != null) return;

        const isDragging = Math.round(this.#startX - this.#x) > 10 || Math.round(this.#startY - this.#y) > 10;

        if (isDragging) {
            if (this.#state === MoveState.AddWidget) {
                this.#dragElement = createDragElement(this.#sourceElement, this.#state, this.#x, this.#y);
                this.#animateMoveHandler();
            }
        }
    }

    #mouseUp(event) {
        document.removeEventListener("mousemove", this.#mouseMoveHandler);
        document.removeEventListener("mouseup", this.#mouseUpHandler);

        this.#dragElement?.remove();
        this.#dragElement = null;
        this.#state = MoveState.None;
        this.#sourceElement = null;
    }
}

function isWidget(element) {
    return element.dataset.widget === "true";
}

function isMoveableElement(element) {
    return element.dataset.moveable === "true";
}

function createDragElement(element, state, x, y) {
    /**
     * If the state is AddWidget, we need to clone the element and return it.
     * This is because we are dragging it from the widget library and we don't want to move the original element.
     */
    if (state === MoveState.AddWidget) {
        return cloneElementForDragging(element, x, y);
    }

    /**
     * If we are moving an existing element on the canvas we don't make a clone of it.
     * When moving a canvas element we will move the original element and place a placeholder where the element was.
     */
    // JHR: todo - implement canvas move.
}

/**
 * @funciton cloneElementForDragging
 * @description Clones the element for dragging.
 * @param element {HTMLElement} - element to clone.
 * @param x
 * @param y
 * @returns {*}
 */
function cloneElementForDragging(element, x, y) {
    const dragElement = element.cloneNode(true);
    dragElement.style.position = "fixed";
    dragElement.style.willChange = "transform";
    dragElement.style.zIndex = 99999999;
    dragElement.style.width = element.offsetWidth + "px";
    dragElement.style.height = element.offsetHeight + "px";
    dragElement.style.translate = `${x}px ${y}px`;

    document.body.appendChild(dragElement);

    return dragElement;
}