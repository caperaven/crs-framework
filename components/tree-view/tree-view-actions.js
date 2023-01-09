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
        let sites = [];
        let sitesNames = [];

        // function calculate(data) {
        //     let arr = []
        //     arr.push(data)
        //     let count = 0;
        //
        //     // let mainContainer = document.createElement('ul');
        //     // let mainTitle = document.createElement('li');
        //     // let mainHeading = document.createElement('span')
        //     // mainHeading.innerHTML = "Main"
        //     // mainTitle.appendChild(mainHeading)
        //     // mainContainer.append(mainTitle)
        //     // document.body.append(mainContainer)
        //
        //     for(item of arr) {
        //         // returns obj with site values as obj
        //         console.log(item.root.children)
        //         sites.push(item.root.children)
        //         // returns array of string values of sites  -- add  .length for num
        //         console.log(Object.keys(item.root.children))
        //
        //         // returns obj with site values as string
        //         Object.keys(item.root.children).forEach((key)=>{
        //             count = count +=1;
        //             // let obj = document.createElement('p')
        //             // obj.innerHTML = `this is  ${key}`
        //             // mainTitle.append(obj)
        //             sitesNames.push(key)
        //         })
        //         console.log(count)
        //         console.log("The site names  are", sitesNames)
        //         console.log("The site Objects are", sites)
        //     }
        // }
        // calculate(result);


        function calculate(data) {
            // loop through all the items in the data structure recursively.
            // if an element has an "amount" value, add it to the count.
            // the function must return you the count of all the amounts.
            // you may only use this function to process the data.
            // the expected result is 89
            let count = 0;
            let arr = []
            arr.push(data)

            for (const child of arr) {
                // count += child.amount || 0;
                console.log(child.root.children)
                child.children != null ? count += calculate(child.children) : count;
            }

            return count;
        }

        const count = calculate(result);
        console.log(count);

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