import{parseEvent as u}from"./utils/parse-event.js";class g{async onEvent(e,r,n,s){await n.value(e,s)}async parse(e){u(e,this.getIntent)}getIntent(e,r){const n=p.call(this,e,r),s=new globalThis.crs.classes.AsyncFunction("event","element",n);return{provider:".setvalue",value:s}}async clear(e){crs.binding.eventStore.clear(e)}}function p(t,e){const r=t.indexOf("="),n=t.substring(0,r).trim(),s=t.substring(r+1,t.length).trim(),o=[],l=m(n,e,o),i=f(s,e,n,o);return[...o,l.replace("__value__",i)].join(" ")}function m(t,e,r){return t.indexOf("attr(")!=-1?d(t,r):t.indexOf("prop(")!=-1?P(t,r):t.indexOf("$global")!=-1?b(t):`crs.binding.data.setProperty(${e}, "${t}", __value__);`}function f(t,e,r,n){return t.indexOf("attr(")!=-1?h(t,n):t.indexOf("prop(")!=-1?$(t,n):t.indexOf("$global")!=-1?_(t):(t.indexOf(r)!=-1&&(t=t.replace(r,`crs.binding.data.getProperty(${e}, "${r}")`)),t=t.replace("$event","event").replace("$target","event.composedPath()[0]"),t)}function h(t,e){const r=t.replace("attr(","").replace(")","").split(","),n=r[0].trim(),s=r[1].trim(),i=r[2].trim().split(" ")[0]=="true";n=="$element"?e.push("const getAttrElement = element;"):e.push(`const getAttrElement = ${i?"document":"element"}.querySelector("${n}");`),e.push(`const attrValue = getAttrElement.getAttribute("${s}");`);const a=t.indexOf(")"),c=Array.from(t);return c.splice(0,a+1,"attrValue"),c.join("")}function d(t,e){const r=t.replace("attr(","").replace(")","").split(","),n=r[0].trim(),s=r[1].trim(),i=r[2].trim().split(" ")[0]=="true";return n=="$element"?e.push("const setAttrElement = element;"):e.push(`const setAttrElement = ${i?"document":"element"}.querySelector("${n}");`),`setAttrElement.setAttribute("${s}", __value__);`}function $(t,e){const r=t.replace("prop(","").replace(")","").split(","),n=r[0].trim(),s=r[1].trim(),i=(r[2]??"").trim().split(" ")[0]=="true";n=="$element"?e.push("const getPropElement = element;"):e.push(`const getPropElement = ${i?"document":"element"}.querySelector("${n}");`),e.push(`const propValue = getPropElement["${s}"];`);const a=t.indexOf(")"),c=Array.from(t);return c.splice(0,a+1,"propValue"),c.join("")}function P(t,e){const r=t.replace("prop(","").replace(")","").split(","),n=r[0].trim(),s=r[1].trim(),i=r[2].trim().split(" ")[0]=="true";return n=="$element"?e.push("const setPropElement = element;"):e.push(`const setPropElement = ${i?"document":"element"}.querySelector("${n}");`),`setPropElement["${s}"] = __value__;`}function b(t){return`crs.binding.data.setProperty(0, "${t.replace("$globals.","")}", __value__);`}function _(t){const e=t.split("$globals."),s=t.substring(t.indexOf("$globals.")+9,t.length).split(" ")[0],o=`crs.binding.data.getProperty(0, "${s}")`;return e[1]=e[1].replace(s,""),e.join(o)}export{p as createSourceFrom,g as default};
