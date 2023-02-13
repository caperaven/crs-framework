/**
 * This is a crs-binding extension for using <template markdown="test.md"> in the HTML
 */

async function schemaTemplate(element, context, options) {
    const folder = options?.folder || "/";
    const file = crsbinding.utils.relativePathFrom(folder, element.getAttribute('schema'));
    const id = element.dataset.parser || "html";
    const schema = await fetch(file).then(result => result.json());
    const html = await crs.call("schema", "parse", {id, schema});

    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    const instance = tpl.content.cloneNode(true);
    await crsbinding.parsers.parseElements(instance.children, context, options);

    const parent = element.parentElement;
    parent.insertBefore(instance, element);
    parent.removeChild(element);
}

crsbinding.templateProviders.add("schema", schemaTemplate);