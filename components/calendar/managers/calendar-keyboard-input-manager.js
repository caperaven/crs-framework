/**
 * @class CalendarKeyboardInputManager - this class manages the keyboard input
 * it allows the user to navigate through the calendar using the following keys
 * Keys:
 * pressing down on the arrowRight moves focus to the next element and sets it tabindexto 0 while
 * setting the previous focusable elements tabindex to -1
 * pressing down on the arrowLeft moves focus to the previous element and sets it tabindexto 0 while
 * setting the previous focusable elements tabindex to -1
 * pressing down on the arrowUp moves focus to the next element above the current focusable element
 * and sets it tabindex to 0 while setting the previous focusable elements tabindex to -1
 * pressing down on the arrowDown moves focus to the next element below the current focusable element
 * and sets it tabindex to 0 while setting the previous focusable elements tabindex to -1
 */

export class CalendarKeyboardInputManager {
    #calendar;
    #keyupHandler;
    #elements;
    #currentIndex;
    #columns;
    #currentViewType;
    #keyboardNavigation = Object.freeze({
        "ArrowRight": this.#arrowRight,
        "ArrowLeft": this.#arrowLeft,
        "ArrowUp": this.#arrowUp,
        "ArrowDown": this.#arrowDown,
        "Enter": this.#enter,
    });
    #columnLength = Object.freeze({
        "months": this.#monthColumns,
        "years": this.#yearColumns,
        "default": this.#defaultColumns
    });

    constructor(calendar) {
        this.#calendar = calendar;
        this.#calendar.shadowRoot.addEventListener('keydown', this.#keyup.bind(this));
    }

    dispose() {
        this.#calendar.shadowRoot.removeEventListener('keydown', this.#keyupHandler);
        this.#calendar = null;
        this.#keyupHandler = null;
        this.#keyboardNavigation = null;
        this.#elements = null;
        this.#currentIndex = null;
        this.#columns = null;
        return null;
    }

   async #keyup(event) {
       if (this.#keyboardNavigation[event.key]) {
           this.#getCurrentViewType();
           await this.#getAllNodeElements();
            event.key !== 'Enter' && (this.#elements[this.#currentIndex].tabIndex = -1);
            this.#keyboardNavigation[event.key].call(this, event);
           await this.#setTabIndexAndFocus();
       }
    }

    async #enter(event) {
        console.log("enter");
    }

    async #arrowRight(event) {
        this.#currentIndex = (this.#currentIndex + 1) >= this.#elements.length ? this.#currentIndex : this.#currentIndex + 1;
    }

    async #arrowLeft(event) {
        this.#currentIndex = (this.#currentIndex - 1) < 0 ? this.#currentIndex : this.#currentIndex - 1;
    }

    async #arrowUp(event) {
        this.#currentIndex = this.#currentIndex - this.#columns < 0 ? this.#currentIndex : this.#currentIndex - this.#columns;
    }

    async #arrowDown(event) {
        this.#currentIndex = (this.#currentIndex + this.#columns) >= this.#elements.length ? this.#currentIndex : this.#currentIndex + this.#columns;
    }

    async #setTabIndexAndFocus() {
        this.#elements[this.#currentIndex].tabIndex = 0;
        this.#elements[this.#currentIndex].focus();
    }

    async #getAllNodeElements() {
        this.#elements = this.#calendar.shadowRoot.querySelectorAll("[role='cell'],[data-type='month-cell'],[data-type='year-cell']");
        this.#currentIndex = Array.prototype.findIndex.call(this.#elements, el => el.tabIndex === 0);
    }

    async #getCurrentViewType() {
        this.#currentViewType = this.#calendar.selectedView;

        if(this.#currentViewType != null){
            await this.#columnLength[this.#currentViewType].call(this);
        }
    }

    async #defaultColumns() {
        this.#columns = 7;
    }

    async #monthColumns() {
        this.#columns = 3;
    }

    async #yearColumns() {
        this.#columns = 4;
    }
}