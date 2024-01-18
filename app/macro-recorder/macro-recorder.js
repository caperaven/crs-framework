
export default class Welcome extends crsbinding.classes.ViewBase {
    async load() {
        await crs.call("macro_recorder", "show");

        await crs.call("dom_interactive", "enable_move", {
            "element": ".draggable",
            "move_query": ".draggable"
        });
        super.load();
    }
}