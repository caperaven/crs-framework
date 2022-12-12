import {BaseProvider} from "../../packages/crs-schema/html/crs-base-provider.js";

export default class ButtonProvider extends BaseProvider{
    get key() {
        return "button";
    }

    async process(item) {
        return `<button>Hello World</button>`;
    }
}