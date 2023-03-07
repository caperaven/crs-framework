// import "./../filter-header/filter-header.js";
// import "./../options-toolbar/options-toolbar.js";
//
// export class DesignerRepo extends crsbinding.classes.BindableElement{
//     container = this.shadowRoot.querySelector("#ul-slot")
//
//     static get observedAttributes() {return ["data-repo", "displayStatus"]};
//
//     get html() {
//         return import.meta.url.replace(".js", ".html");
//     }
//
//     set displayStatus(newValue){
//         this.setProperty("displayStatus", newValue)
//         this.#loadHTML();
//     }
//
//     get displayStatus(){
//         return this.getProperty("displayStatus")
//     }
//
//     // constructor() {
//     //     super();
//     //     this.attachShadow({mode:"open"})
//     // }
//
//     get shadowDom() {
//         return true
//     }
//
//     async connectedCallback() {
//         await super.connectedCallback();
//         await crs.call("dom_interactive", "enable_resize", {
//             element: this,
//             resize_query : ".resize",
//             options: {}
//         })
//
//         // pull template from html
//         // clone content for new filter-header
//         // attach the new content to designer-repo component
//         await this.#initTemplates()
//     }
//
//     async disconnectedCallback () {
//         await crs.call("dom_interactive", "disable_resize", {
//             element: this
//         })
//         await super.disconnectedCallback();
//     }
//
//     async #initTemplates(){
//         const templateFilter = this.shadowRoot.querySelector("#filter-header"); // had to add the .content
//         const cloneFilter = templateFilter.content.cloneNode(true);
//         // const slot = this.shadowRoot.querySelector('#filter-slot');
//         this.appendChild(cloneFilter);
//         // this.shadowRoot.appendChild(slot)
//
//         const templateUl = this.shadowRoot.querySelector("#ul-template"); // had to add the .content
//         const cloneUl = templateUl.content.cloneNode(true);
//         const slot = this.shadowRoot.querySelector('#main-ul');
//
//         this.appendChild(cloneUl);
//
//     }
//
//     async #loadHTML () {
//         console.log("test");
//         console.log(this.container, "here is container")
//
//
//
//         // const status = this.getProperty("displayStatus");
//         const status = this.displayStatus
//
//         if(status == null || this.dataset.repo == null) {
//             return ;
//         }
//         const file = `/templates/designer-repo/${this.dataset.repo}-${status}.html`;
//
//         this.shadowRoot.querySelector("#ul-slot").innerHTML = await fetch(file).then(result => result.text());
//         // this.container.setAttribute("displayStatus", status)
//         const filter = this.getProperty("filter");
//         if((filter || "").length > 0 ) {
//             for(const child of this.container.children){
//                 if(child.dataset.tags.indexOf(filter) === -1) {
//                     child.setAttribute("hidden", "hidden");
//                 }
//             }
//         }
//     }
//
//     preLoad () {
//         // this.setProperty("displayStatus", "grid");
//         this.displayStatus = "grid"
//     }
//
//     async displayStatusChanged(newValue) {
//         await this.#loadHTML()
//     }
//
//     async attributeChangedCallback() {
//         await this.#loadHTML()
//     }
//
//     async filterChanged(newValue) {
//         await crs.call("dom_collection", "filter_children", {
//             element: this.container,
//             filter: newValue
//         })
//     }
// }
//
// customElements.define("designer-repo", DesignerRepo);


import "./../filter-header/filter-header.js";
import "./../options-toolbar/options-toolbar.js";

export class DesignerRepo extends crsbinding.classes.BindableElement{
    #container;
    #clickHandler = this.#click.bind(this)

    static get observedAttributes() {return ["data-repo", "displayStatus"]};

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    set displayStatus(newValue){
        this.setProperty("displayStatus", newValue)
    }

    get displayStatus(){
        return this.getProperty("displayStatus")
    }

    // constructor() {
    //     super();
    //     this.attachShadow({mode:"open"})
    // }

    get shadowDom() {
        return true
    }

    async connectedCallback() {
        await super.connectedCallback();


        //add notify_ready
        await this.load()


        // pull template from html
        // clone content for new filter-header
        // attach the new content to designer-repo component
        await this.#initTemplates()

    }

    /**
     * @method load - load the component.
     * set up event listeners and set aria attributes.
     * @returns {Promise<void>}
     */
    load() {
        return new Promise(resolve => {
            requestAnimationFrame(async () => {
                this.#container = this.shadowRoot.querySelector("ul")
                console.log(this.#container, "here is container on shadow")

                const status = this.displayStatus;
                if(status == null || this.dataset.repo == null) {
                    return;
                }

                const file = `/templates/designer-repo/${this.dataset.repo}-${status}.html`;
                this.shadowRoot.querySelector("#ul-slot").innerHTML = await fetch(file).then(result => result.text());

                this.shadowRoot.addEventListener("click", this.#clickHandler)
                await crs.call("dom_interactive", "enable_resize", {
                    element: this,
                    resize_query : this.shadowRoot.querySelector(".resize-icon"),
                    options: {}
                })
                await crs.call("component", "notify_ready", {element: this});

                resolve();

            });

        })
    }

    async disconnectedCallback () {
        await super.disconnectedCallback();
        await crs.call("dom_interactive", "disable_resize", {
            element: this
        })

        this.shadowRoot.removeEventListener("click", this.#clickHandler)
        this.#container = null;
        this.#clickHandler = null;

    }

    async #initTemplates() {
        const templateFilter = this.shadowRoot.querySelector("#filter-header");
        const filterHeaderContent = templateFilter.content;

        const cloneFilter = filterHeaderContent.cloneNode(true);
        this.appendChild(cloneFilter);
    }



    async displayStatusChanged(newValue) {
        console.log("attribute changed", this.displayStatus)
        this.displayStatus = newValue;

        await this.load()
    }

    async attributeChangedCallback() {
        this.displayStatus === "grid" ? this.displayStatus = "list" : this.displayStatus = "grid";
        // await this.load()
    }


    async #click(event) {
        console.log("click")
        const target = event.composedPath()[0];
        console.log(target)
        if (target.nodeName === "BUTTON") {
            if(this.displayStatus === "grid") {
                this.displayStatus = "list";
                // this.shadowRoot.querySelector("ul").classList.remove("grid")
                // this.shadowRoot.querySelector("ul").classList.add("list")
            }
            else {
                this.displayStatus = "grid"
            }
        }
    }
}

customElements.define("designer-repo", DesignerRepo);