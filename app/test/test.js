import "./../../components/tree-view/tree-view.js"
import "./../../components/tree-view/tree-view-actions.js"

export default class Test extends crsbinding.classes.ViewBase {
    #data;

    get data(){
        return this.#data
    }


    async connectedCallback() {
        await super.connectedCallback();
        await this.groupData();
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

    async groupData() {
        const data = [
            {title:"title 1", site: "A21", isActive: true},
            {title:"title 2", site: "A21", isActive: true},
            {title:"title 3", site: "A11", isActive: true},
            {title:"title 4", site: "A11", isActive: false},
            {title:"title 5", site: "A11", isActive: false},
            {title:"title 6", site: "A11", isActive: true},
            {title:"title 7", site: "A31", isActive: false}
        ]

        let  result = await crs.call("tree_view", "show", {
            target: this.tree,
            data: data
        })

        // const result = await crs.call("data", "group", {
        //     source: data,
        //     fields: ["site"] // ,"isActive"
        // });
        //
        //
        // this.#data = result
        // // console.log("test.js file = ", this.#data)
        //
        // this.json.innerText = JSON.stringify(result);
    }
}