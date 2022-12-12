import {BaseProvider} from "../../packages/crs-schema/html/crs-base-provider.js";

export default class ButtonProvider extends BaseProvider{
    get key() {
        return "button";
    }

    async process(item) {
        const parts = await super.process(item);
        return `<button ${parts.attributes}>Hello World</button>`;
    }
}