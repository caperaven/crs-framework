import "./../../components/check-box/check-box.js";

export default class CheckBox extends crsbinding.classes.ViewBase {
    #fieldset
    #tri;
    #conds;
    #clickHander = this.#click.bind(this);

    async connectedCallback() {
        await super.connectedCallback();
        this.#initView();
    }

    disconnectedCallback() {
        this.#fieldset.removeEventListener("click", this.#clickHander);
        this.#clickHander = null;
        this.#fieldset = null;
        this.#tri = null;
        this.#conds = null;
    }

    #initView() {
        this.#fieldset = document.querySelector("fieldset");
        this.#tri = this.#fieldset.querySelector("#tri");
        this.#conds = Array.from(this.#fieldset.querySelectorAll("ul input"));

        this.#fieldset.addEventListener("click", this.#clickHander);
    }

    async #click(event) {
        if (event.target !== this.#tri && this.#conds.find(item => item === event.target) == null) return;

        if (event.target === this.#tri) {
            for (const item of this.#conds) {
                item.checked = this.#tri.checked;
            }
        } else {
            const currentChecked = event.target.checked;

            let allEqual = true;
            for (const item of this.#conds) {
                if (item === event.target) continue;

                if (item.checked !== currentChecked) {
                    allEqual = false;
                    break;
                }
            }

            this.#tri.status = allEqual === false ? "indeterminate" : currentChecked;
        }
    }
}