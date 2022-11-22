export class DesignerRepo extends crsbinding.classes.BindableElement{
    static get observedAttribute() {return ["data-repo"]};

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        await super.connectedCallback();
        await crs.call("dom_interactive", "enable_resize", {
            element: this,
            resize_query : ".resize",
            options: {}
        })
    }

    async disconnectedCallback () {
        await crs.call("dom_interactive", "disable_resize", {
            element: this
        })
        await super.disconnectedCallback();
    }

    async #loadHTML () {
        const status = this.getProperty("displayStatus");

        if(status == null || this.dataset.repo == null) {
            return ;
        }
        const file = `/templates/designer-repo/${this.dataset.repo}-${status}.html`;

        this.container.innerHTML = await fetch(file).then(result => result.text());
        const filter = this.getProperty("filter");
        if((filter || "").length > 0 ) {
            for(const child of this.container.children){
                if(child.dataset.tags.indexOf(filter) == -1) {
                    child.setAttribute("hidden", "hidden");
                }
            }
        }
    }

    preLoad () {
        this.setProperty ("displayStatus", "grid");
    }

    async displayStatusChanged(newValue) {
        await this.#loadHTML()
    }

    async attributeChangedCallback() {
        await this.#loadHTML()
    }

    async filterChanged(newValue) {
        await crs.call("dom_collection", "filter_children", {
            element: this.container,
            filter: newValue
        })
    }
}

customElements.define("designer-repo", DesignerRepo);