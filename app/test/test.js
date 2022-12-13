export default class Test extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        await this.groupData();
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }

    async groupData() {
        const data = [
            {title:"title 1", site: "A21", isActive: true},
            {title:"title 2", site: "A21", isActive: true},
            {title:"title 3", site: "A11", isActive: true},
            {title:"title 4", site: "A11", isActive: false},
            {title:"title 5", site: "A11", isActive: false},
            {title:"title 6", site: "A11", isActive: true},
            {title:"title 7", site: "A31", isActive: false}
        ]

        const result = await crs.call("data", "group", {
            source: data,
            fields: ["site"] // ,"isActive"
        });

        console.log(result);

        this.json.innerText = JSON.stringify(result);
    }
}