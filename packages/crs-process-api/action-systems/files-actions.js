class m{static async perform(e,t,a,l){await this[e.action](e,t,a,l)}static async load(e,t,a,l){if(await crs.process.getValue(e.args.dialog,t,a,l)==!0){const r=await p(e);let i=[];for(const s of r){const o=await u(s.name);i.push({name:o.name,ext:o.ext,type:s.type,size:s.size,value:s})}return e.args.target!=null&&await crs.process.setValue(e.args.target,i,t,a,l),i}else{const r=await y(e,t,a,l);return e.args.target!=null&&await crs.process.setValue(e.args.target,r,t,a,l),r}}static async save(e,t,a,l){const c=await crs.process.getValue(e.args.details,t,a,l);let r=document.createElement("a");r.style.display="none",document.body.appendChild(r);for(let i of c){let s=new Blob([i.value],{type:i.type}),o=window.URL.createObjectURL(s);r.href=o,r.download=`${i.name}.${i.ext}`,r.click(),window.URL.revokeObjectURL(o),o=null,s=null}r.parentElement.removeChild(r),r=null}static async save_canvas(e,t,a,l){const c=await crs.dom.get_element(e.args.source),r=await crs.process.getValue(e.args.name,t,a,l)||"image",i=c.toDataURL("image/png");let s=document.createElement("a");s.style.display="none",document.body.appendChild(s),s.href=i.replace("image/png","image/octet-stream"),s.download=`${r}.png`,s.click(),s.parentElement.removeChild(s),s=null}static async enable_dropzone(e,t,a,l){const c=await crs.dom.get_element(e.args.element,t,a,l),r=await crs.process.getValue(e.args.callback,t,a,l);c.addEventListener("drop",f),c.addEventListener("dragover",d),c.addEventListener("dragleave",g),c.__callback=r}static async disable_dropzone(e,t,a,l){const c=await crs.dom.get_element(e.args.element,t,a,l);c.removeEventListener("drop",f),c.removeEventListener("dragover",d),c.removeEventListener("dragleave",g),delete c.__callback}}class w{static async blob(e){return new Promise(t=>{const a=new FileReader;a.onload=()=>{a.onload=null,t(a.result)},a.readAsArrayBuffer(e)})}}async function u(n){const e=n.split("/"),a=e[e.length-1].split("."),l=a[a.length-1];return{name:a[0],ext:l}}async function p(){return new Promise(n=>{let e=document.createElement("input");e.type="file",e.setAttribute("multiple","multiple"),e.onchange=()=>{e.onchange=null;const t=Array.from(e.files);n(t)},e.click()})}async function y(n,e,t,a){const l=await crs.process.getValue(n.args.files,e,t,a),c=[];for(const r of l){const i=await u(r);c.push({name:i.name,ext:i.ext,value:await fetch(r).then(s=>s.blob())})}return c}async function d(n){n.preventDefault(),n.currentTarget.__callback.call(this,{action:"dragOver",event:n})}async function g(n){n.preventDefault(),n.currentTarget.__callback.call(this,{action:"dragLeave",event:n})}async function f(n){n.preventDefault();const e=n.dataTransfer.files,t=[];for(const a of e){const l=await u(a.name);t.push({type:a.type,name:l.name,ext:l.ext,size:a.size,value:a})}n.currentTarget.__callback.call(this,{action:"drop",event:n,results:t})}crs.intent.files=m;export{w as FileFormatter,m as FilesActions,u as get_file_name,y as get_files};
