class i{async parse(t,e){crs.binding.utils.unmarkElement(t);const n=await p(t,e),c=await fetch(n).then(s=>s.text()),a=document.createElement("template");a.innerHTML=c;const o=a.content.cloneNode(!0);await crs.binding.translations.parseElement(o),t.replaceWith(o)}}async function p(r,t){const e=r.getAttribute("src");if(e.indexOf("$context")===-1)return e;const n=e.split("/"),c=n[0].replace("$context.",""),a=await crs.binding.data.getProperty(t,c);return n[0]=a,n.join("/")}export{i as default};
