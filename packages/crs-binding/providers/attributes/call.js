import{parseEvent as u}from"./utils/parse-event.js";import{getQueries as p}from"./utils/get-queries.js";class f{async onEvent(t,s,e){await d(s,e,t)}async parse(t){u(t,this.getIntent)}getIntent(t){const s={provider:".call",value:t};return p(t,s),s}async clear(t){crs.binding.eventStore.clear(t)}}async function d(l,t,s){const e=crs.binding.data.getContext(l);if(e==null)return;const o=t.value.replace(")","").split("("),n=o[0],c=o.length==1?[s]:m(o[1],s,l);if(t.queries!=null){let r;e instanceof crs.classes.BindableElement?r=e.shadowRoot||e:e.element!=null?r=e.element.shadowRoot||e.element:r=document;for(let i of t.queries){const a=r.querySelector(i);await a[n].call(a,...c)}return}await e[n].call(e,...c)}function m(l,t,s){const e=[],o=l.split(",");for(let n of o){if(n=n.trim(),n.indexOf("$context.")!=-1){const c=n.replace("$context.",""),r=crs.binding.data.getProperty(s,c);e.push(r);continue}if(n==="$event"){e.push(t);continue}else if(Number.isNaN(n)==!0){e.push(Number(n));continue}else if(n.indexOf("'")==0){e.push(n.replaceAll("'",""));continue}else e.push(n)}return e}export{f as default};
