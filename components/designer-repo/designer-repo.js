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

export class DesignerRepo extends crsbinding.classes.BindableElement{
    container = this.shadowRoot.querySelector("#ul-slot")

    static get observedAttributes() {return ["data-repo", "displayStatus"]};

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    set displayStatus(newValue){
        this.setProperty("displayStatus", newValue)
        this.#loadHTML();
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
        await crs.call("dom_interactive", "enable_resize", {
            element: this,
            resize_query : ".resize",
            options: {}
        })

        // pull template from html
        // clone content for new filter-header
        // attach the new content to designer-repo component
        // await this.#initTemplates()

        this.container = this.shadowRoot.querySelector("ul")
        await this.#loadHTML()
    }

    async disconnectedCallback () {
        await crs.call("dom_interactive", "disable_resize", {
            element: this
        })
        await super.disconnectedCallback();
    }

    // async #initTemplates(){
    //     const templateFilter = this.shadowRoot.querySelector("#filter-header"); // had to add the .content
    //     const cloneFilter = templateFilter.content.cloneNode(true);
    //     // const slot = this.shadowRoot.querySelector('#filter-slot');
    //     this.appendChild(cloneFilter);
    //     // this.shadowRoot.appendChild(slot)
    //
    //     const templateOptionsToolbar = this.shadowRoot.querySelector("#options-toolbar"); // had to add the .content
    //     const cloneOptionsToolbar = templateOptionsToolbar.content.cloneNode(true);
    //     this.appendChild(cloneOptionsToolbar);
    //
    //     const templateUl = this.shadowRoot.querySelector("#ul-template"); // had to add the .content
    //     const cloneUl = templateUl.content.cloneNode(true);
    //     const slot = this.shadowRoot.querySelector('#ul-slot');
    //     slot.setAttribute("displayStatus", "grid")
    //     slot.appendChild(cloneUl);
    //
    //     this.appendChild(cloneUl);
    //
    // }

    async #loadHTML () {
        console.log("test");
        console.log(this.container, "here is container")



        // const status = this.getProperty("displayStatus");
        const status = this.displayStatus

        if(status == null || this.dataset.repo == null) {
            return ;
        }
        const file = `/templates/designer-repo/${this.dataset.repo}-${status}.html`;

        this.shadowRoot.querySelector("#ul-slot").innerHTML = await fetch(file).then(result => result.text());
        // this.container.setAttribute("displayStatus", status)
        const filter = this.getProperty("filter");
        if((filter || "").length > 0 ) {
            for(const child of this.container.children){
                if(child.dataset.tags.indexOf(filter) === -1) {
                    child.setAttribute("hidden", "hidden");
                }
            }
        }
    }

    preLoad () {
        // this.setProperty("displayStatus", "grid");
        this.displayStatus = "grid"
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