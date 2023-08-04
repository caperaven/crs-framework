export class OverflowBar extends crs.classes.BindableElement {
    get html() { return import.meta.url.replace(".js", ".html"); }
    get shadowDom() { return true; }

    async load() {
        console.log(this.children);
        requestAnimationFrame(() => {
            const width = this.offsetWidth;
            let right = 0;

            let hasOverflow = false;
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];

                if (hasOverflow) {
                    child.setAttribute("aria-hidden", "true");
                    // todo add an item to the overflow for this child
                    continue;
                }

                right += child.offsetWidth;
                if (right > width) {
                    child.setAttribute("aria-hidden", "true");
                    hasOverflow = true;
                }
            }

            if (hasOverflow) {
                this.btnOverflow.removeAttribute("aria-hidden");
            }
        })
    }
}

customElements.define("overflow-bar", OverflowBar);