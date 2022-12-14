import "./tree-view.js";
import Test from "../../app/test/test.js";

export class TreeViewActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async show(step, context, process, item) {
        const target = await crs.dom.get_element(step.args.element, context, process, item);
        const instance = new Test()
        const data = instance.data
        // const data = await crs.process.getValue(step.args.data, context, process, item);

        console.log(data)


    }

    static async test() {
        console.log("actions test")
    }
}

crs.intent.tree_view = TreeViewActions;