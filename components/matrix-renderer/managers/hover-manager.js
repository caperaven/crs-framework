export class HoverManager extends EventTarget {
    #element;
    #clientX;
    #clientY;
    #lastMoved;
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #timerHandler = this.#timer.bind(this);
    #animationId;

    initialize(element) {
        this.#element = element;
        this.#element.addEventListener("mousemove", this.#mouseMoveHandler);
    }

    dispose() {
        this.#element.removeEventListener("mousemove", this.#mouseMoveHandler);
        this.#element = null;
        this.#clientY = null;
        this.#clientX = null;
        this.#lastMoved = null;
        this.#mouseMoveHandler = null;
        this.#timerHandler = null;
        return null;
    }

    #mouseMove(event) {
        this.#clientX = event.clientX;
        this.#clientY = event.clientY;
        this.#lastMoved = performance.now();

        if (this.#animationId == null) {
            this.#timer();
        }
    }

    #timer() {
        const now = performance.now();

        if (now - this.#lastMoved < 100) {
            this.#animationId = requestAnimationFrame(this.#timerHandler);
            return;
        }

        cancelAnimationFrame(this.#animationId);
        this.#animationId = null;

        this.#hovering();
    }

    #hovering() {
        this.dispatchEvent(new CustomEvent("hover", {
            detail: {
                x: this.#clientX,
                y: this.#clientY
            }
        }));
    }
}