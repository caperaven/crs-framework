class u{#a={};#s={};constructor(){this.#a={}}dispose(){this.#a=null,this.#s=null}async register(s,a,r,e){const t=await crs.createSchemaLoader(new a(e));for(const i of r)t.register((await import(i)).default);return this.#a[s]=t,this.#s[s]=[],t}async unregister(s){this.#a[s]?.dispose(),this.#s[s]=null,delete this.#a[s]}async parse(s,a,r){return new Promise(async e=>{const t=async()=>{typeof a=="string"&&(a=await fetch(a).then(c=>c.json()));const i=await this.#a[s].parse(a,r);e(i)};this.#e(s,t)})}#e(s,a){this.#s[s].push(a),this.#s[s].length===1&&this.#r(s)}#r(s){this.#s[s].length<1||this.#s[s][0]().then(()=>this.#s[s].shift()).then(this.#r.bind(this,s))}}class l{static async perform(s,a,r,e){await this[s.action]?.(s,a,r,e)}static async register(s,a,r,e){const t=await crs.process.getValue(s.args.id,a,r,e),i=await crs.process.getValue(s.args.parser,a,r,e),c=await crs.process.getValue(s.args.providers,a,r,e),h=await crs.process.getValue(s.args.parameters,a,r,e),n=await crs.schemaParserManager.register(t,i,c,h);return s.args.target!=null&&await crs.process.setValue(s.args.target,n,a,r,e),n}static async unregister(s,a,r,e){const t=await crs.process.getValue(s.args.id,a,r,e);await crs.schemaParserManager.unregister(t)}static async parse(s,a,r,e){const t=await crs.process.getValue(s.args.id,a,r,e),i=await crs.process.getValue(s.args.schema,a,r,e),c=await crs.schemaParserManager.parse(t,i,a);return s.args.target!=null&&await crs.process.setValue(s.args.target,c,a,r,e),c}}globalThis.crs||={},crs.schemaParserManager=new u,crs.intent.schema=l;export{l as SchemaActions};
