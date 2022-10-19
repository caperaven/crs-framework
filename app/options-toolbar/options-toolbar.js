export default class OptionsToolbar extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async selectedChanged(event) {
        console.log(event.detail);
    }
}