class V{static async perform(a,r,t,s){await this[a.action]?.(a,r,t,s)}static async inflate(a,r,t,s){if(a.args.parameters==null)return a.args.template;let l=a.args.template,n=a.args.parameters,e=await _(l,n,r,t,s);return a.args.target!=null&&await crs.process.setValue(a.args.target,e,r,t,s),e}static async to_array(a,r,t,s){let n=(await crs.process.getValue(a.args.source,r,t,s)).split(a.args.pattern);return a.args.target!=null&&await crs.process.setValue(a.args.target,n,r,t,s),n}static async from_array(a,r,t,s){let l=await crs.process.getValue(a.args.source,r,t,s),n=a.args.separator||"",e=l.join(n);return a.args.target!=null&&await crs.process.setValue(a.args.target,e,r,t,s),e}static async replace(a,r,t,s){let l=await crs.process.getValue(a.args.source,r,t,s);const n=await crs.process.getValue(a.args.pattern,r,t,s),e=await crs.process.getValue(a.args.value,r,t,s);let u=l.split(n).join(e);return a.args.target!=null&&await crs.process.setValue(a.args.target,u,r,t,s),u}static async get_query_string(a,r,t,s){const l=await crs.process.getValue(a.args.source,r,t,s),n=await crs.process.getValue(a.args.complex_parameters,r,t,s);if((l||"").trim()==="")return;let e;const u=l.includes("?")?l.split("?")[1]:l,f=new URLSearchParams(u);for(const[i,g]of f)if(!((i||"").trim()===""||(g||"").trim()==="")){if((n||[]).includes(i)){const w=g.split(";");for(const y of w){const o=await this.get_query_string({args:{source:y}});o!=null&&(e=e||{},e[i]=e[i]||{},Object.assign(e[i],o))}continue}e=e||{},e[i]=g}return a.args.target!=null&&e!=null&&await crs.process.setValue(a.args.target,e,r,t,s),e}}async function _(c,a,r,t,s){c=c.split("${").join("${context."),a=await m(a,r,t,s);let l=new Function("context",["return `",c,"`;"].join("")),n=l(a);return l=null,n}async function m(c,a,r,t){const s=Object.keys(c);for(let l of s){let n=c[l];c[l]=await crs.process.getValue(n,a,r,t)}return c}crs.intent.string=V;export{V as StringActions};
