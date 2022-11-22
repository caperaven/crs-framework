/**
 * This is a crs-binding extension for using <template markdown="test.md"> in the HTML
 */

async function markdownTemplate(element, context, options) {
    const folder = options?.folder || "/";
    const file = crsbinding.utils.relativePathFrom(folder, element.getAttribute('markdown'));
    const md = await fetch(file).then(result => result.text());
    const html = await crs.call("markdown", "to_html", {markdown: md});

    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    const instance = tpl.content.cloneNode(true);
    await crsbinding.parsers.parseElements(instance.children, context, options);

    const parent = element.parentElement;
    parent.insertBefore(instance, element);
    parent.removeChild(element);
}

crsbinding.templateProviders.add("markdown", markdownTemplate);