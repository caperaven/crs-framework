import "./tree-view.js";
import Test from "../../app/test/test.js";

export class TreeViewActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async show(step, context, process, item) {
        const target = await crs.dom.get_element(step.args.element, context, process, item);
        const data = await crs.process.getValue(step.args.data, context, process, item);

        const result = await crs.call("data", "group", {
            source: data,
            fields: ["site","title", "isActive"] // ,"isActive"
        });

        console.log(result);

        let A11 = [];
        let A21 = [];
        let A31 = [];

        function calculate(data) {
            let arr = []
            arr.push(data)
            for(item of arr) {
                // returns obj with site values as obj
                console.log(item.root.children)
                if (typeof item.root.children === "object") {
                    console.log("true")
                }
                // returns obj with site values as string
                Object.keys(item.root.children).forEach((key)=>{
                    console.log(typeof key)
                })

            }

        }

        // const endResult = calculate(result);
        // console.log(calculate(result));
        calculate(result);


        // function calculateSum(object) {
        //     for(let item in object) {
        //         if(item === "A11") {
        //             console.log("Object returned : ", object[item].children)
        //             let titles = object[item].children
        //             console.log(Object.entries(titles))
        //
        //             console.log(object[item])
        //             A11.push(object[item].rows)
        //         }
        //
        //
        //         if(typeof(object[item]) == "object") {
        //             calculateSum(object[item])
        //         }
        //     }
        // }
        // calculateSum(result)
        // console.log(A11)

    }

    static async sort_data(step, context, process, item) {
        const titles = []
        const keys = []
        const data = await crs.process.getValue(step.args.data, context, process, item);

        console.log(typeof data)
        for(let entry of Object.entries(data)) {
            // console.log(entry[1].site)
            titles.push(entry[1].title)
            keys.push(entry[1].site)
        }
        console.log(titles)
        console.log(keys)
    }

    static async test() {
        console.log("actions test")
    }
}

crs.intent.tree_view = TreeViewActions;