
export default class Welcome extends crsbinding.classes.ViewBase {
    async load() {
        await crs.call("macro_recorder", "show");
        super.load();
    }
}