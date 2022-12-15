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

            this.data = [
                {title:"title 1", site: "A21", isActive: true},
                {title:"title 2", site: "A21", isActive: true},
                {title:"title 3", site: "A11", isActive: true},
                {title:"title 4", site: "A11", isActive: false},
                {title:"title 5", site: "A11", isActive: false},
                {title:"title 6", site: "A11", isActive: true},
                {title:"title 7", site: "A31", isActive: false}
            ]


            // await this.sortData();
            // await this.testAction()



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

    // async sortData() {
    //     const dataResult = await crs.call("tree_view", "show", {
    //         target: this.element,
    //         data : this.data
    //     })
    //
    //     await crs.call("tree_view", "sort_data", {data: this.data})
    // }
    //
    // async testAction() {
    //     await crs.call("tree_view", "test")
    // }



}

customElements.define("tree-view", TreeView);