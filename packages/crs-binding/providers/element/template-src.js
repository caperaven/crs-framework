class TemplateSrcProvider {
  async parse(element) {
    const path = element.getAttribute("src");
    const content = await fetch(path).then((result) => result.text());
    const template = document.createElement("template");
    template.innerHTML = content;
    element.replaceWith(template.content.cloneNode(true));
  }
}
export {
  TemplateSrcProvider as default
};
