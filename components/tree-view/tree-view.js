import "./../../app/test/test.js"

class TreeView extends crsbinding.classes.BindableElement {
    #clickHandler;


    get shadowDom() {
        return true;
    }

    get html() {
        return import.meta.url.replace(".js", ".html");
    }
    


    async connectedCallback() {
        return new Promise(async (resolve) => {
            await super.connectedCallback();

            this.#clickHandler = this.click.bind(this);
            this.shadowRoot.addEventListener("click", this.#clickHandler);

            await crsbinding.translations.add({
                approved: "Approved"
            });

            this.data = {
                "name": "Andre"
            }

            await this.sortData();



            requestAnimationFrame(async () => {
                const buttonTest = this.shadowRoot.querySelector("#clickBtn");

                await crs.call("component", "notify_ready", {element: this});
                resolve();
            })
        });
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;

    }



    async click(event) {
        if (event.target.matches("#clickBtn")) {
            console.log("match")
        }
    }

    async sortData() {
        await crs.call("tree_view", "show", {
            target: this.element
        })
    }



}

customElements.define("tree-view", TreeView);