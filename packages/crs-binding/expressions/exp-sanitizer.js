import{tokenize as u}from"./exp-tokenizer.js";const d=["false","true","null"];async function O(e,n="context"){let s=!1;if(typeof e=="string"&&e.indexOf("$html")!=-1&&(s=!0,e=e.split("$html.").join("")),e==null||e=="null"||e=="undefined"||d.indexOf(e.toString())!=-1||isNaN(e)==!1||e.trim()==n)return{isLiteral:!0,expression:e,isHTML:s};if(n!="context"==!0&&e==["${",n,"}"].join(""))return{isLiteral:!0,expression:e};const a=new Set,l=e.indexOf("${")!=-1||e.indexOf("&{")!=-1,f=u(e,l),i=[];for(let t of f)t.type=="property"?(t.value.indexOf("$globals")!=-1?i.push(t.value.replace("$globals","crs.binding.data.globals")):t.value.indexOf("$event")!=-1?i.push(t.value.replace("$event","event")):t.value.indexOf("$context")!=-1?i.push(t.value.replace("$context","context")):t.value.indexOf("$data")!=-1?i.push(t.value.replace("$data","crs.binding.data.getValue")):t.value.indexOf("$parent")!=-1?i.push(t.value.replace("$parent","parent")):n!=="context"&&t.value.indexOf(`${n}.`)!=-1?i.push(t.value):i.push(`${n}.${t.value}`),$(a,t.value,n)):i.push(t.value);let o=i.join("").replaceAll("context.[","[").replaceAll("context.]","]");return o=await crs.binding.expression.translateFactory(o),{isLiteral:l,isHTML:s,expression:o,properties:Array.from(a)}}const c=[".trim",".toLowerCase","toUpperCase"],p=["$data","$event","[","]"];function $(e,n,s){if(n.length==0)return;for(let l of p)if(n.indexOf(l)!=-1)return;let r=n;const a=`${s}.`;r.indexOf(a)==0&&(r=r.replace(a,""));for(let l of c)r.indexOf(l)!=-1&&(r=r.split(l).join(""));e.add(r)}export{O as sanitize};
