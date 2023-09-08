class FsActions {
  static async perform(step, context, process, item) {
    await this[step.action](step, context, process, item);
  }
  static async select_folder(step, context, process, item) {
  }
  static async create_folder(step, context, process, item) {
  }
  static async select_file(step, context, process, item) {
    let fileHandle;
    [fileHandle] = await window.showOpenFilePicker();
    return fileHandle;
  }
  static async read_file(step, context, process, item) {
    const handle = await crs.process.getValue(step.args?.handle, context, process, item);
    const fileHandle = handle || await this.select_file(step, context, process, item);
    const file = await fileHandle.getFile();
    return await file.text();
  }
  static async read_json(step, context, process, item) {
    const text = await this.read_file(step, context, process, item);
    return JSON.parse(text);
  }
  static async save_file(step, context, process, item) {
    const fileHandle = await crs.process.getValue(step.args.handle, context, process, item);
    const content = await crs.process.getValue(step.args.content, context, process, item);
    await writeFile(fileHandle, content);
  }
  static async write_new_file(step, context, process, item) {
    const fileTypes = await crs.process.getValue(step.args.file_types, context, process, item);
    const defaultName = await crs.process.getValue(step.args.default_name, context, process, item);
    const fileHandle = await getSaveHandle(fileTypes, defaultName);
    const content = await crs.process.getValue(step.args.content, context, process, item);
    await writeFile(fileHandle, content);
    return fileHandle;
  }
  static async write_new_json(step, context, process, item) {
    const json = await crs.process.getValue(step.args.content, context, process, item);
    const defaultName = "untitled.json";
    const fileTypes = [
      {
        description: "JSON Files",
        accept: {
          "text/json": [".json"]
        }
      }
    ];
    const fileHandle = await getSaveHandle(fileTypes, defaultName);
    await writeFile(fileHandle, JSON.stringify(json, null, "	"));
    return fileHandle;
  }
  static async open_folder(step, context, process, item) {
    const handle = await crs.process.getValue(step.args?.handle, context, process, item);
    const dirHandle = handle || await window.showDirectoryPicker();
    await verifyPermission(dirHandle, true);
    const results = [];
    for await (const entry of dirHandle.values()) {
      results.push(entry);
    }
    return results;
  }
}
async function writeFile(fileHandle, contents) {
  if (typeof contents == "object") {
    contents = JSON.stringify(contents, null, 4);
  }
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}
async function getSaveHandle(types, defaultName) {
  const options = {
    suggestedName: defaultName || "Untitled.txt",
    types: types || []
  };
  return await window.showSaveFilePicker(options);
}
async function verifyPermission(fileHandle, readWrite) {
  const options = {};
  if (readWrite) {
    options.mode = "readwrite";
  }
  if (await fileHandle.queryPermission(options) === "granted") {
    return true;
  }
  if (await fileHandle.requestPermission(options) === "granted") {
    return true;
  }
  return false;
}
crs.intent.fs = FsActions;
export {
  FsActions
};
