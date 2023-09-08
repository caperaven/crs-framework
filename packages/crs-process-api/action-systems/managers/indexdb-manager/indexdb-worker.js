const META_TABLE_NAME = "_meta";
const META_DB_NAME = "meta_database";
const VERSION = 1;
class Database {
  #dbName;
  #db = null;
  #getAvailableStoreQueue = [];
  #metaInit(newMetaData) {
    if (newMetaData.length === 0)
      return;
    return this.#performTransaction((store) => {
      let result;
      for (const meta of newMetaData) {
        result = store.put(meta, meta.storeName);
      }
      return result;
    }, "readwrite", META_TABLE_NAME);
  }
  #metaGet(storeName) {
    return this.#performTransaction((store) => {
      return store.get(storeName);
    }, "readonly", META_TABLE_NAME);
  }
  #metaUpdate(data, storeName) {
    return this.#performTransaction((store) => {
      return store.put(data, storeName);
    }, "readwrite", META_TABLE_NAME);
  }
  #metaZero(storeNames, count = true, timestamp = true) {
    return this.#performTransaction(async (store) => {
      for (const storeName of storeNames) {
        const request = store.get(storeName);
        const meta = await new Promise((resolve, reject) => {
          request.onsuccess = (event) => {
            resolve(event.target.result);
          };
          request.onerror = (event) => {
            reject(event);
          };
        });
        if (count)
          meta.count = 0;
        if (timestamp)
          meta.timestamp = null;
        store.put(meta, storeName);
      }
    }, "readwrite", META_TABLE_NAME);
  }
  connect(dbName, version, count, storeNames) {
    return new Promise((resolve, reject) => {
      this.#dbName = dbName;
      const newMegaData = [];
      const request = self.indexedDB.open(this.#dbName, version);
      request.onerror = (event) => {
        reject(event.target.error);
      };
      request.onsuccess = async (event) => {
        this.#db = event.target.result;
        await this.#metaInit(newMegaData);
        updateMetaDB(dbName);
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (db.objectStoreNames.contains(META_TABLE_NAME) === false) {
          db.createObjectStore(META_TABLE_NAME);
        }
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            let countString = i < 10 ? `0${i}` : i;
            const storeName = `table_${countString}`;
            const objectStore = db.createObjectStore(storeName);
            objectStore.createIndex("idIndex", "id", { unique: true });
            newMegaData.push({
              storeName,
              timestamp: null,
              count: 0
            });
          }
        }
        for (const storeName of storeNames) {
          if (db.objectStoreNames.contains(storeName) === false) {
            const objectStore = db.createObjectStore(storeName);
            objectStore.createIndex("idIndex", "id", { unique: true });
            newMegaData.push({
              storeName,
              timestamp: null,
              count: 0
            });
          }
        }
      };
    });
  }
  async disconnect() {
    if (this.#db) {
      this.#db.close();
      this.#db = null;
    }
  }
  #performTransaction(callback, mode = "readwrite", storeName) {
    return new Promise(async (resolve, reject) => {
      const transaction = this.#db.transaction([storeName], mode);
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
      const store = transaction.objectStore(storeName);
      const request = await callback(store);
      if (request) {
        request.onsuccess = (event) => {
          updateMetaDB(this.#dbName);
          return resolve(event.target.result);
        };
        request.onerror = (event) => {
          return reject(event.target.error);
        };
      } else {
        resolve();
      }
    });
  }
  markNextTableAsUsed() {
    return new Promise((resolve, reject) => {
      const transaction = this.#db.transaction([META_TABLE_NAME], "readwrite");
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
      const store = transaction.objectStore(META_TABLE_NAME);
      const request = store.openCursor();
      request.onsuccess = async (event) => {
        let cursor = event.target.result;
        do {
          const value = cursor.value;
          const storeName = value.storeName;
          const timeStamp = value.timestamp;
          if (timeStamp == null) {
            const meta = cursor.value;
            meta.timestamp = new Date();
            store.put(meta, storeName);
            resolve(storeName);
            break;
          }
        } while (cursor.continue());
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  getAvailableStore() {
    return new Promise(async (resolve, reject) => {
      const storeName = await this.markNextTableAsUsed().catch((error) => reject(error));
      resolve(storeName);
    });
  }
  releaseStores(storeNames) {
    return new Promise(async (resolve, reject) => {
      if (Array.isArray(storeNames) === false) {
        storeNames = [storeNames];
      }
      this.clear(storeNames, true, true).then(() => resolve()).catch((error) => reject(error));
    });
  }
  set(storeName, records, clear = false) {
    return new Promise(async (resolve, reject) => {
      storeName ||= await this.getAvailableStore().catch((error) => reject(error));
      if (clear == true) {
        await this.clear([storeName], true, false).catch((error) => reject(error));
      }
      const meta = await this.#metaGet(storeName).catch((error) => reject(error));
      await new Promise((resolve2, reject2) => {
        this.#performTransaction(async (store) => {
          for (const record of records) {
            await store.put(record, meta.count);
            meta.count += 1;
          }
          resolve2();
        }, "readwrite", storeName).catch((error) => reject2(error));
      });
      meta.timestamp = new Date();
      await this.#metaUpdate(meta, storeName).catch((error) => reject(error));
      resolve(storeName);
    });
  }
  add(storeName, record, meta) {
    return this.#performTransaction((store) => {
      const index = meta.count;
      meta.count += 1;
      return store.add(record, index);
    }, "readwrite", storeName);
  }
  addWithIndex(storeName, record, index) {
    return this.#performTransaction((store) => {
      return store.add(record, index);
    }, "readwrite", storeName);
  }
  get(storeName, index) {
    return this.#performTransaction((store) => {
      return store.get(index);
    }, "readonly", storeName);
  }
  update(storeName, data, key) {
    return this.#performTransaction((store) => {
      return store.put(data, key);
    }, "readwrite", storeName);
  }
  deleteIndexes(storeName, indexes) {
    return this.#performTransaction((store) => {
      if (Array.isArray(indexes) === false) {
        indexes = [indexes];
      }
      let result;
      for (const index of indexes) {
        result = store.delete(index);
      }
      return result;
    }, "readwrite", storeName);
  }
  deleteRange(storeName, start, end) {
    return this.#performTransaction((store) => {
      return store.delete(IDBKeyRange.bound(start, end));
    }, "readwrite", storeName);
  }
  async clear(storeNames, zeroCount = true, zeroTimestamp = true) {
    await this.#metaZero(storeNames, zeroCount, zeroTimestamp);
    const promises = [];
    for (let storeName of storeNames) {
      promises.push(
        this.#performTransaction((store) => {
          return store.clear();
        }, "readwrite", storeName)
      );
    }
    return Promise.all(promises);
  }
  getAll(storeName) {
    return this.#performTransaction((store) => {
      return store.getAll();
    }, "readonly", storeName);
  }
  getBatch(storeName, startIndex, endIndex) {
    return new Promise((resolve, reject) => {
      const result = [];
      const transaction = this.#db.transaction([storeName], "readonly");
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
      const store = transaction.objectStore(storeName);
      const range = IDBKeyRange.bound(startIndex, endIndex, false, false);
      const request = store.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
  getRecordsByIndex(storeName, indexes) {
    const promises = indexes.map(
      (index) => this.#performTransaction((store) => {
        return store.get(index);
      }, "readonly", storeName)
    );
    return Promise.all(promises);
  }
  getValues(storeName, fields, indexes) {
    return this.#performTransaction((store) => {
      const request = store.getAll(indexes);
      request.onsuccess = (event) => {
        const records = event.target.result;
        const values = records.map((record) => {
          const value = {};
          for (const field of fields) {
            value[field] = record[field];
          }
          return value;
        });
        return values;
      };
    }, "readonly", storeName);
  }
  hasKey(storeName, key) {
    return this.#performTransaction((store) => {
      return store.getKey(key);
    }, "readonly", storeName);
  }
  getById(storeName, ids) {
    return new Promise(async (resolve, reject) => {
      const transaction = this.#db.transaction([storeName], "readonly");
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
      const store = transaction.objectStore(storeName);
      if (Array.isArray(ids) === false) {
        ids = [ids];
      }
      const index = store.index("idIndex");
      const result = [];
      for (const id of ids) {
        index.get(id).onsuccess = (event) => {
          if (event.target.result == null)
            return;
          result.push(event.target.result);
        };
      }
      transaction.oncomplete = () => {
        resolve(result);
      };
    });
  }
  updateById(storeName, models) {
    return new Promise(async (resolve, reject) => {
      if (Array.isArray(models) === false) {
        models = [models];
      }
      const transaction = this.#db.transaction([storeName], "readwrite");
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
      const store = transaction.objectStore(storeName);
      const index = store.index("idIndex");
      for (const model of models) {
        const request = index.getKey(model.id);
        request.onsuccess = (event) => {
          store.put(model, event.target.result);
        };
      }
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
  deleteById(storeName, ids) {
    return new Promise(async (resolve, reject) => {
      const transaction = this.#db.transaction([storeName], "readwrite");
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
      const store = transaction.objectStore(storeName);
      const index = store.index("idIndex");
      if (Array.isArray(ids) === false) {
        ids = [ids];
      }
      for (const id of ids) {
        const request = index.getKey(id);
        request.onsuccess = (event) => {
          const key = event.target.result;
          store.delete(key);
        };
      }
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
  delete_by_index(storeName, indexes) {
    return new Promise(async (resolve, reject) => {
      const transaction = this.#db.transaction([storeName], "readwrite");
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
      const store = transaction.objectStore(storeName);
      if (Array.isArray(indexes) === false) {
        indexes = [indexes];
      }
      for (const index of indexes) {
        store.delete(index);
      }
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
  getOldDatbaseNames() {
    return new Promise((resolve, reject) => {
      const transaction = self.db.transaction([META_TABLE_NAME], "readonly");
      transaction.onerror = (event) => {
        console.error(event.target.error);
      };
      const store = transaction.objectStore(META_TABLE_NAME);
      const request = store.openCursor();
      const toRemove = [];
      const now = Date.now();
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          do {
            const dbTime = cursor.value.timestamp;
            if (now - dbTime > duration) {
              toRemove.push(cursor.key);
            }
          } while (cursor.continue());
        }
        resolve();
      };
    });
  }
  changeByIndex(storeName, index, changes) {
    return new Promise(async (resolve, reject) => {
      const transaction = this.#db.transaction([storeName], "readwrite");
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
      const store = transaction.objectStore(storeName);
      if (Array.isArray(index) === false) {
        index = [index];
      }
      const keys = Object.keys(changes);
      for (const i of index) {
        const request = store.get(i);
        request.onsuccess = (event) => {
          const record = event.target.result;
          for (const key in keys) {
            record[key] = changes[key];
          }
          store.put(record);
        };
      }
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
  changeById(storeName, id, changes) {
    return new Promise(async (resolve, reject) => {
      const transaction = this.#db.transaction([storeName], "readwrite");
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = (event) => {
        const record = event.target.result;
        for (const key in changes) {
          record[key] = changes[key];
        }
        store.put(record);
      };
      transaction.oncomplete = () => {
        resolve();
      };
    });
  }
}
class IndexDBManager {
  #store = {};
  #performAction(uuid, name2, callback) {
    return new Promise(async (resolve, reject) => {
      if (this.#store[name2] === void 0) {
        reject({
          uuid,
          success: false,
          error: new Error(`Database ${name2} is not connected`)
        });
      }
      await callback().then((result) => {
        resolve({
          uuid,
          success: true,
          data: result
        });
      }).catch((error) => {
        reject({
          uuid,
          success: false,
          error
        });
      });
    });
  }
  connect(uuid, dbName, version, count, storeNames) {
    return new Promise(async (resolve, reject) => {
      if (this.#store[dbName] !== void 0) {
        resolve({
          uuid,
          result: true
        });
      }
      const instance = new Database();
      await instance.connect(dbName, version, count, storeNames).catch((error) => {
        reject({
          uuid,
          result: false,
          error
        });
      });
      this.#store[dbName] = instance;
      resolve({
        uuid,
        result: true
      });
    });
  }
  disconnect(uuid, names) {
    return this.#performAction(uuid, name, async () => {
      if (Array.isArray(names) === false) {
        names = [names];
      }
      for (const name2 of names) {
        delete this.#store[name2];
      }
    });
  }
  getAvailableStore(uuid, name2) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].getAvailableStore();
    });
  }
  releaseStores(uuid, name2, stores) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].releaseStores(stores);
    });
  }
  set(uuid, name2, store, records, clear) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].set(store, records, clear);
    });
  }
  add(uuid, name2, store, record) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].add(store, record);
    });
  }
  clear(uuid, name2, store, zeroCount, zeroTimestamp) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].clear(store, zeroCount, zeroTimestamp);
    });
  }
  get(uuid, name2, store, indexes) {
    return this.#performAction(uuid, name2, async () => {
      if (Array.isArray(indexes) === false) {
        return await this.#store[name2].get(store, indexes);
      }
      return await this.#store[name2].getRecordsByIndex(store, indexes);
    });
  }
  getAll(uuid, name2, store) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].getAll(store);
    });
  }
  getBatch(uuid, name2, store, startIndex, endIndex, count) {
    return this.#performAction(uuid, name2, async () => {
      endIndex ||= startIndex + count - 1;
      return await this.#store[name2].getBatch(store, startIndex, endIndex);
    });
  }
  deleteIndexes(uuid, name2, store, indexes) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].deleteIndexes(store, indexes);
    });
  }
  deleteRange(uuid, name2, store, startIndex, endIndex) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].deleteRange(store, startIndex, endIndex);
    });
  }
  getById(uuid, name2, store, id) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].getById(store, id);
    });
  }
  updateById(uuid, name2, store, models) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].updateById(store, models);
    });
  }
  deleteOldDatabase(uuid, duration2) {
    return new Promise(async (resolve, reject) => {
      let toRemove = await getOldDatabases(duration2).catch((error) => reject(error));
      if (toRemove.length === 0) {
        resolve({
          uuid,
          success: true,
          data: null
        });
      }
      toRemove = toRemove.filter((item) => this.#store[item] == null);
      const wasRemoved = [];
      for (const name2 of toRemove) {
        await new Promise((resolve2) => {
          const deleteDatabaseRequest = indexedDB.deleteDatabase(name2);
          deleteDatabaseRequest.onsuccess = () => {
            wasRemoved.push(name2);
            resolve2();
          };
          deleteDatabaseRequest.onerror = (event) => {
            console.error(event.target.error);
          };
        });
      }
      const transaction = self.metaDB.transaction([META_TABLE_NAME], "readwrite");
      const store = transaction.objectStore(META_TABLE_NAME);
      for (const name2 of wasRemoved) {
        store.delete(name2);
      }
      transaction.oncomplete = () => {
        resolve({
          uuid,
          result: true
        });
      };
    });
  }
  deleteDatabase(uuid, name2) {
    return new Promise((resolve, reject) => {
      if (this.#store[name2] != null) {
        this.#store[name2].disconnect();
        delete this.#store[name2];
      }
      const deleteDatabaseRequest = indexedDB.deleteDatabase(name2);
      deleteDatabaseRequest.onerror = (event) => {
        reject({
          uuid,
          success: false,
          error: event.target.error
        });
      };
      deleteDatabaseRequest.onsuccess = () => {
        const transaction = self.metaDB.transaction([META_TABLE_NAME], "readwrite");
        const store = transaction.objectStore(META_TABLE_NAME);
        const request = store.delete(name2);
        request.onsuccess = () => {
          resolve({
            uuid,
            success: true,
            data: null
          });
        };
        request.onerror = (event) => {
          reject({
            uuid,
            success: false,
            error: event.target.error
          });
        };
      };
    });
  }
  deleteById(uuid, name2, store, id) {
    return this.#performAction(uuid, name2, async () => {
      return await this.#store[name2].deleteById(store, id);
    });
  }
}
function getOldDatabases(duration2) {
  return new Promise(async (resolve, reject) => {
    const toRemove = [];
    const transaction = self.metaDB.transaction([META_TABLE_NAME], "readonly");
    const store = transaction.objectStore(META_TABLE_NAME);
    const now = new Date();
    const cursorRequest = store.openCursor();
    cursorRequest.onsuccess = async (event) => {
      let cursor = event.target.result;
      while (cursor) {
        const dbName = cursor.key;
        const dbDate = cursor.value.timestamp;
        if (now - dbDate > duration2) {
          toRemove.push(dbName);
        }
        cursor = cursor.continue();
      }
    };
    transaction.oncomplete = () => {
      resolve(toRemove);
    };
  });
}
function connectMetaDB() {
  return new Promise((resolve, reject) => {
    const request = self.indexedDB.open(META_DB_NAME, VERSION);
    request.onerror = (event) => {
      reject(event.target.error);
    };
    request.onsuccess = async (event) => {
      self.metaDB = event.target.result;
      resolve();
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(META_TABLE_NAME);
    };
  });
}
function updateMetaDB(dbName) {
  const transaction = self.metaDB.transaction([META_TABLE_NAME], "readwrite");
  transaction.onerror = (event) => {
    console.error(event.target.error);
  };
  const store = transaction.objectStore(META_TABLE_NAME);
  store.put({ timestamp: new Date() }, dbName);
}
const actionsToPerformOnLoad = [];
connectMetaDB().then(() => {
  self.manager = new IndexDBManager();
  for (const action of actionsToPerformOnLoad) {
    self.onmessage(action);
  }
}).catch((error) => console.error(error));
self.onmessage = async function(event) {
  if (self.manager == null) {
    actionsToPerformOnLoad.push(event);
    return;
  }
  const action = event.data.action;
  const args = event.data.args;
  const uuid = event.data.uuid;
  if (self.manager[action]) {
    await self.manager[action](uuid, ...args).then((result) => self.postMessage(result)).catch((error) => self.postMessage(error));
  }
};
