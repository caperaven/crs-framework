async function bindingUpdate(uuid, ...properties) {
  const element = crs.binding.elements[uuid];
  if (element == null)
    return;
  let intent = crs.binding.eventStore.getIntent("change", uuid);
  intent ||= crs.binding.eventStore.getIntent("component-change", uuid);
  if (Array.isArray(intent)) {
    for (const i of intent) {
      await applyProperty(element, i, ...properties);
    }
    return;
  }
  await applyProperty(element, intent, ...properties);
}
async function applyProperty(element, intent, ...properties) {
  if (properties.length === 0) {
    properties = Object.keys(intent.value);
  }
  for (const property of properties) {
    const targetProperty = intent.value[property];
    if (targetProperty == null)
      continue;
    element[targetProperty] = await crs.binding.data.getProperty(element["__bid"], property) ?? "";
  }
}
export {
  bindingUpdate
};
