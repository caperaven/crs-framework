class IndexDBManager {
  #worker;
  #requests = {};
  constructor() {
    const workerUrl = new URL("./indexdb-manager/indexdb-worker.js", import.meta.url);
    this.#worker = new Worker(workerUrl, { type: "module" });
    this.#worker.onmessage = this.onMessage.bind(this);
  }
  dispose() {
    this.#worker.onmessage = null;
    this.#worker.terminate();
    this.#worker = null;
    this.#requests = null;
  }
  async perform(step, context, process, item) {
    await this[step.action](step, context, process, item);
  }
  onMessage(event) {
    const returnPromise = this.#requests[event.data.uuid];
    try {
      if (event.data.success === false) {
        returnPromise.reject(event.data.error);
      } else {
        returnPromise.resolve(event.data);
      }
    } finally {
      delete this.#requests[event.data.uuid];
    }
  }
  #performWorkerAction(action, args, uuid) {
    return new Promise(async (resolve, reject) => {
      this.#requests[uuid] = { resolve, reject };
      this.#worker.postMessage({
        action,
        args,
        uuid
      });
    });
  }
  async connect(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const version = await crs.process.getValue(step.args.version, context, process, item);
    const count = await crs.process.getValue(step.args.count, context, process, item);
    const storeNames = await crs.process.getValue(step.args.storeNames, context, process, item);
    return await this.#performWorkerAction("connect", [name, version, count ?? 0, storeNames ?? []], crypto.randomUUID());
  }
  async disconnect(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    return await this.#performWorkerAction("disconnect", [name], crypto.randomUUID());
  }
  async get_available_store(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    return await this.#performWorkerAction("getAvailableStore", [name], crypto.randomUUID());
  }
  async release_stores(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const stores = await crs.process.getValue(step.args.stores, context, process, item);
    return await this.#performWorkerAction("releaseStores", [name, stores], crypto.randomUUID());
  }
  async set(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const records = await crs.process.getValue(step.args.records, context, process, item);
    const clear = await crs.process.getValue(step.args.clear ?? false, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    return await this.#performWorkerAction("set", [name, store, records, clear], crypto.randomUUID());
  }
  async add(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const record = await crs.process.getValue(step.args.record, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    return await this.#performWorkerAction("add", [name, store, record], crypto.randomUUID());
  }
  async clear(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const stores = await crs.process.getValue(step.args.stores, context, process, item);
    const zeroCount = await crs.process.getValue(step.args.zeroCount ?? true, context, process, item);
    const zerTimeline = await crs.process.getValue(step.args.zeroTimeline ?? true, context, process, item);
    return await this.#performWorkerAction("clear", [name, stores, zeroCount, zerTimeline], crypto.randomUUID());
  }
  async get_all(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    return await this.#performWorkerAction("getAll", [name, store], crypto.randomUUID());
  }
  async get(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const indexes = await crs.process.getValue(step.args.indexes, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    return await this.#performWorkerAction("get", [name, store, indexes], crypto.randomUUID());
  }
  async get_batch(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    const startIndex = await crs.process.getValue(step.args.startIndex, context, process, item);
    const endIndex = await crs.process.getValue(step.args.endIndex, context, process, item);
    const count = await crs.process.getValue(step.args.count, context, process, item);
    return await this.#performWorkerAction("getBatch", [name, store, startIndex, endIndex, count], crypto.randomUUID());
  }
  async get_page(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    const page = await crs.process.getValue(step.args.page, context, process, item);
    const pageSize = await crs.process.getValue(step.args.pageSize, context, process, item);
    const startIndex = (page - 1) * pageSize;
    return await this.#performWorkerAction("getBatch", [name, store, startIndex, null, pageSize], crypto.randomUUID());
  }
  async get_by_id(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    const id = await crs.process.getValue(step.args.id, context, process, item);
    return await this.#performWorkerAction("getById", [name, store, id], crypto.randomUUID());
  }
  async update_by_id(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    const models = await crs.process.getValue(step.args.models, context, process, item);
    return await this.#performWorkerAction("updateById", [name, store, models], crypto.randomUUID());
  }
  async change_by_index(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    const index = await crs.process.getValue(step.args.index, context, process, item);
    const changes = await crs.process.getValue(step.args.changes, context, process, item);
    return await this.#performWorkerAction("changeByIndex", [name, store, index, changes], crypto.randomUUID());
  }
  async change_by_id(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    const id = await crs.process.getValue(step.args.id, context, process, item);
    const changes = await crs.process.getValue(step.args.changes, context, process, item);
    return await this.#performWorkerAction("changeById", [name, store, id, changes], crypto.randomUUID());
  }
  async delete_old_db(step, context, process, item) {
    const duration = await crs.process.getValue(step.args.duration, context, process, item);
    return await this.#performWorkerAction("deleteOldDatabase", [duration], crypto.randomUUID());
  }
  async delete_db(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    return await this.#performWorkerAction("deleteDatabase", [name], crypto.randomUUID());
  }
  async delete_by_id(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    const ids = await crs.process.getValue(step.args.ids, context, process, item);
    return await this.#performWorkerAction("deleteById", [name, store, ids], crypto.randomUUID());
  }
  async delete_by_index(step, context, process, item) {
    const name = await crs.process.getValue(step.args.name, context, process, item);
    const store = await crs.process.getValue(step.args.store, context, process, item);
    const index = await crs.process.getValue(step.args.index, context, process, item);
    return await this.#performWorkerAction("deleteByIndex", [name, store, index], crypto.randomUUID());
  }
}
crs.intent.idb = new IndexDBManager();
export {
  IndexDBManager
};
