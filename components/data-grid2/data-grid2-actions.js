import "./data-grid2.js";
import {Columns, ConversionType} from "./columns/columns.js";

class DataGrid2Actions {
    static async perform(step, context, process, item) {
        let action = DataGrid2Actions[step.action];
        if (action) {
            return action(step, context, process, item);
        }
    }

    static async initialize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const columns = Columns.from(ConversionType.HTML, element);
        console.log(element)
    }
}

crs.intent.datagrid2 = DataGrid2Actions;