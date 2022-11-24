import "./../../components/tab-list/tab-list.js";

export default class TabList extends crsbinding.classes.ViewBase {
    get html() {
        return import.meta.url;
    }

    async preLoad() {
        const translations = {
            view1: "View 1",
            view2: "View 2",
            view3: "View 3"
        }

        await crsbinding.translations.add(translations);
    }

    async connectedCallback() {
        requestAnimationFrame( async () => {
            await super.connectedCallback();
        })
    }
}