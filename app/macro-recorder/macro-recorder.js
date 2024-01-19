import "/components/macro-recorder/macro-recorder-actions.js";
import "/components/text-editor/text-editor.js";

export default class Welcome extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async load() {
        requestAnimationFrame(async () => {
            await crs.call("macro_recorder", "show");

            const element = this.shadowRoot.querySelector(".draggable");
            await crs.call("dom_interactive", "enable_move", {
                "element": element,
                "move_query": ".draggable"
            });
        })
    }
}