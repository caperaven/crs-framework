import {Positions} from "./scripts/utils/positions.js"

/**
 * @const MoveState
 * @description The state of the move operation
 * @type {Readonly<{AddWidget: number, MoveElement: number, None: number}>}
 */
const MoveState =  Object.freeze({
    None: 0,
    AddWidget: 1,
    MoveElement: 2
});

/**
 * @const IGNORE_DROP_ELEMENTS
 * @description Elements that we don't want to drop elements on.
 * @type {string[]}
 */
const IGNORE_DROP_ELEMENTS = ["block-widgets", "dialog-component"];

/**
 * @class DragDropManager
 * @description Manages the drag and drop operations.
 */
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
    #dropWidgetId = null;
    #marker;
    #currentHoverElement;
    #currentPosition = Positions.APPEND;

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
        this.#dropWidgetId = null;
        return null;
    }

    /**
     * @method animateMove
     * @description Animates the move operation.
     * This is activated when movement starts and stops when the movement stops.
     */
    #animateMove() {
        // animation is no longer required so stop the animation timer.
        if (this.#dragElement == null) return;

        this.#dragElement.style.translate = `${this.#x}px ${this.#y}px`;

        this.#updateMarker()

        requestAnimationFrame(this.#animateMoveHandler);
    }

    /**
     * @method mouseDown
     * @description Handles the mouse down event.
     * This starts the move operation if the conditions are met.
     * @param event
     */
    #mouseDown(event) {
        const target = event.composedPath()[0];

        // 1. are we moving a widget from the library
        if (isWidget(target)) {
            this.#state = MoveState.AddWidget;
            this.#dropWidgetId = target.id;
        }
        // 2. or are we moving an element in the case.
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

        this.#marker = addMarker();
    }

    /**
     * @method mouseMove
     * @description Handles the mouse move event.
     * This moves the element preview and also updates the drop marker using the animate method.
     * We here just want to update the values required for the animation.
     * @param event
     * @returns {Promise<void>}
     */
    async #mouseMove(event) {
        this.#x = Math.round(event.clientX);
        this.#y = Math.round(event.clientY);

        // if we already have a dragElement we just want to update the position
        if (this.#dragElement != null) return;

        const isDragging = Math.round(this.#startX - this.#x) > 3 || Math.round(this.#startY - this.#y) > 3;

        if (isDragging) {
            if (this.#state === MoveState.AddWidget) {
                this.#dragElement = createDragElement(this.#sourceElement, this.#state, this.#x, this.#y);
                this.#animateMoveHandler();
            }
        }
    }

    /**
     * @method mouseUp
     * @description Handles the mouse up event.
     * This ends the drag operation and performs the drop operation of the correct target is selected.
     * @param event
     * @returns {Promise<void>}
     */
    async #mouseUp(event) {
        document.removeEventListener("mousemove", this.#mouseMoveHandler);
        document.removeEventListener("mouseup", this.#mouseUpHandler);

        if (this.#currentHoverElement != null) {
            await this.#dropElement(this.#currentHoverElement);
        }

        this.#dragElement?.remove();
        this.#dragElement = null;
        this.#state = MoveState.None;
        this.#sourceElement = null;

        this.#marker.remove();
        this.#marker = null;
        this.#currentHoverElement = null;
    }

    /**
     * @method dropElement
     * @description Drops the element on the canvas at the correct position.
     * @param target
     * @returns {Promise<void>}
     */
    async #dropElement(target) {
        const {widget, script} = await crsbinding.events.emitter.emit("getWidgetLibrary", { id: this.#dropWidgetId });

        const args = widget.args;
        const action = script["createInstance"];

        await action(target, args, this.#currentPosition, this.#dropWidgetId);
    }

    /**
     * @method updateMarker
     * @description Updates the drop marker based on the current hover element.
     * If we are to append to the container, show the marker at the bottom of the children.
     * If the container is empty, show it at the top of the empty container but, it there are
     * children and, you hover over a element that is a child of a container, then show it before the element.
     */
    #updateMarker() {
        const elements = document.elementsFromPoint(this.#x, this.#y);
        const tagName = elements[0].tagName.toLowerCase();
        const parentTagName = elements[1].tagName.toLowerCase();

        if (tagName in IGNORE_DROP_ELEMENTS || parentTagName in IGNORE_DROP_ELEMENTS) {
            this.#currentHoverElement = null;
            return;
        }

        if (elements[0] !== this.#currentHoverElement) {
            this.#currentHoverElement = elements[0];

            // drop this in a container
            if (this.#currentHoverElement.dataset.droptarget === "true") {
                const currentRect = this.#currentHoverElement.getBoundingClientRect();
                const lastChildRect = this.#currentHoverElement.lastElementChild?.getBoundingClientRect();

                // if we are hitting the container between elements we don't want to show it as appended so hide it
                if (lastChildRect != null && lastChildRect.bottom > this.#y) {
                    return this.#marker.classList.add("hidden");
                }

                const x = currentRect.left;
                let y = currentRect.top;

                if (this.#currentHoverElement.children.length > 0) {
                    const lastChildRect = this.#currentHoverElement.lastElementChild.getBoundingClientRect();
                    y += lastChildRect.bottom - currentRect.top;
                }

                this.#marker.classList.remove("hidden");
                this.#marker.style.width = `${this.#currentHoverElement.offsetWidth}px`;
                this.#marker.style.translate = `${x}px ${y}px`;
                this.#currentPosition = Positions.APPEND;
                return;
            }

            // if we hover over a element inside a container we want to add it before that element.
            if (this.#currentHoverElement.parentElement.dataset.droptarget === "true") {
                const parentRect = this.#currentHoverElement.parentElement.getBoundingClientRect();
                const currentRect = this.#currentHoverElement.getBoundingClientRect()

                const x = parentRect.left;
                let y = currentRect.top;

                this.#marker.classList.remove("hidden");
                this.#marker.style.width = `${parentRect.width}px`;
                this.#marker.style.translate = `${x}px ${y}px`;
                this.#currentPosition = Positions.BEFORE;
                return;
            }
        }
    }
}

/**
 * @function isWidget
 * @description Checks if the element is a widget.
 * @param element
 * @returns {boolean}
 */
function isWidget(element) {
    return element.dataset.widget === "true";
}

/**
 * @function isMoveableElement
 * @description Checks if the element is moveable.
 * @param element
 * @returns {boolean}
 */
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
    dragElement.style.pointerEvents = "none";

    document.body.appendChild(dragElement);

    return dragElement;
}

/**
 * @function addMarker
 * @description Adds a marker to the body to indicate the drop zone
 * @returns {HTMLDivElement}
 */
function addMarker() {
    const marker = document.createElement("div");
    marker.classList.add("designer-marker", "hidden");
    document.body.appendChild(marker);
    return marker;
}