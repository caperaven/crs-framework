import"/packages/crs-schema/crs-schema.js";class g{#a;constructor(){this.#a={}}async register(a,r,e){const s=await crs.createSchemaLoader(new r);for(const t of e)s.register((await import(t)).default);this.#a[a]=s}async unregister(a){this.#a[a]?.dispose(),delete this.#a[a]}async parse(a,r,e){return typeof r=="string"&&(r=await fetch(r).then(s=>s.json())),await this.#a[a].parse(r,e)}}class o{static async perform(a,r,e,s){await this[a.action]?.(a,r,e,s)}static async register(a,r,e,s){const t=await crs.process.getValue(a.args.id,r,e,s),i=await crs.process.getValue(a.args.parser,r,e,s),c=await crs.process.getValue(a.args.providers,r,e,s);await crs.schemaParserManager.register(t,i,c)}static async unregister(a,r,e,s){const t=await crs.process.getValue(a.args.id,r,e,s);await crs.schemaParserManager.unregister(t)}static async parse(a,r,e,s){const t=await crs.process.getValue(a.args.id,r,e,s),i=await crs.process.getValue(a.args.schema,r,e,s),c=await crs.schemaParserManager.parse(t,i,r);return a.args.target!=null&&await crs.process.setValue(a.args.target,c,r,e,s),c}}globalThis.crs||={},crs.schemaParserManager=new g,crs.intent.schema=o;export{o as SchemaActions};
