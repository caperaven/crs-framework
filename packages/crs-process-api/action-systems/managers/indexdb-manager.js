class i{#s;#r={};constructor(){const a=new URL("./indexdb-manager/indexdb-worker.js",import.meta.url);this.#s=new Worker(a,{type:"module"}),this.#s.onmessage=this.onMessage.bind(this)}dispose(){this.#s.onmessage=null,this.#s.terminate(),this.#s=null,this.#r=null}async perform(a,s,r,e){await this[a.action](a,s,r,e)}onMessage(a){const s=this.#r[a.data.uuid];try{a.data.success===!1?s.reject(a.data.error):s.resolve(a.data)}finally{delete this.#r[a.data.uuid]}}#a(a,s,r){return new Promise(async(e,t)=>{this.#r[r]={resolve:e,reject:t},this.#s.postMessage({action:a,args:s,uuid:r})})}async connect(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.version,s,r,e),c=await crs.process.getValue(a.args.count,s,r,e),o=await crs.process.getValue(a.args.storeNames,s,r,e);return await this.#a("connect",[t,n,c??0,o??[]],crypto.randomUUID())}async disconnect(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e);return await this.#a("disconnect",[t],crypto.randomUUID())}async get_available_store(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e);return await this.#a("getAvailableStore",[t],crypto.randomUUID())}async release_stores(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.stores,s,r,e);return await this.#a("releaseStores",[t,n],crypto.randomUUID())}async set(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.records,s,r,e),c=await crs.process.getValue(a.args.clear??!1,s,r,e),o=await crs.process.getValue(a.args.store,s,r,e);return await this.#a("set",[t,o,n,c],crypto.randomUUID())}async add(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.record,s,r,e),c=await crs.process.getValue(a.args.store,s,r,e);return await this.#a("add",[t,c,n],crypto.randomUUID())}async clear(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.stores,s,r,e),c=await crs.process.getValue(a.args.zeroCount??!0,s,r,e),o=await crs.process.getValue(a.args.zeroTimeline??!0,s,r,e);return await this.#a("clear",[t,n,c,o],crypto.randomUUID())}async get_all(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.store,s,r,e);return await this.#a("getAll",[t,n],crypto.randomUUID())}async get(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.indexes,s,r,e),c=await crs.process.getValue(a.args.store,s,r,e);return await this.#a("get",[t,c,n],crypto.randomUUID())}async get_batch(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.store,s,r,e),c=await crs.process.getValue(a.args.startIndex,s,r,e),o=await crs.process.getValue(a.args.endIndex,s,r,e),g=await crs.process.getValue(a.args.count,s,r,e);return await this.#a("getBatch",[t,n,c,o,g],crypto.randomUUID())}async get_page(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.store,s,r,e),c=await crs.process.getValue(a.args.page,s,r,e),o=await crs.process.getValue(a.args.pageSize,s,r,e),g=(c-1)*o;return await this.#a("getBatch",[t,n,g,null,o],crypto.randomUUID())}async get_by_id(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.store,s,r,e),c=await crs.process.getValue(a.args.id,s,r,e);return await this.#a("getById",[t,n,c],crypto.randomUUID())}async update_by_id(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.store,s,r,e),c=await crs.process.getValue(a.args.models,s,r,e);return await this.#a("updateById",[t,n,c],crypto.randomUUID())}async change_by_index(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.store,s,r,e),c=await crs.process.getValue(a.args.index,s,r,e),o=await crs.process.getValue(a.args.changes,s,r,e);return await this.#a("changeByIndex",[t,n,c,o],crypto.randomUUID())}async change_by_id(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.store,s,r,e),c=await crs.process.getValue(a.args.id,s,r,e),o=await crs.process.getValue(a.args.changes,s,r,e);return await this.#a("changeById",[t,n,c,o],crypto.randomUUID())}async delete_old_db(a,s,r,e){const t=await crs.process.getValue(a.args.duration,s,r,e);return await this.#a("deleteOldDatabase",[t],crypto.randomUUID())}async delete_db(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e);return await this.#a("deleteDatabase",[t],crypto.randomUUID())}async delete_by_id(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.store,s,r,e),c=await crs.process.getValue(a.args.ids,s,r,e);return await this.#a("deleteById",[t,n,c],crypto.randomUUID())}async delete_by_index(a,s,r,e){const t=await crs.process.getValue(a.args.name,s,r,e),n=await crs.process.getValue(a.args.store,s,r,e),c=await crs.process.getValue(a.args.index,s,r,e);return await this.#a("deleteByIndex",[t,n,c],crypto.randomUUID())}}crs.intent.idb=new i;export{i as IndexDBManager};
