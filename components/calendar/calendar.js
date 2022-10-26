export default class Calendar extends crsbinding.classes.BindableElement {
    #month;
    #year;

    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.#month = this.date.getMonth();
        this.#year = this.date.getFullYear();

        const tplCell = this.shadowRoot.querySelector("#tplCell");
        await crsbinding.inflationManager.register("calendar-cell", tplCell);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await crsbinding.inflationManager.unregister("calendar-cell");
        this.date = null;
    }

    preLoad() {
        this.date = new Date();
        const month =  this.date.toLocaleString('en-US', {month: 'long'});

        this.setProperty("selectedView", "default");
        this.setProperty("month",month);
        this.setProperty("year",this.date.getFullYear());
    }

    async #render() {
        const data = await crs.call("dates", "get_days", {month: this.#month, year: this.#year, only_current: false});
        const cells = this.shadowRoot.querySelectorAll("[role='cell']");
        crsbinding.inflationManager.get("calendar-cell", data, cells);
    }

    async #selectedView(newView) {
        requestAnimationFrame(async () => this.setProperty("selectedView", newView))
    }

    async viewLoaded() {
        const currentView = this.getProperty("selectedView");

        if (currentView === "default") {
            requestAnimationFrame(async () => await this.#render());
        }
    }

   async Month() {
        const currentView = "months";
        await this.#selectedView(currentView);
    }

    async Year() {
        const currentView = "years";
        await this.#selectedView(currentView);
    }



}
customElements.define("calendar-component", Calendar);