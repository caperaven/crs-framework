class u{#t={};#e=this.#r.bind(this);get store(){return this.#t}async#r(t){const e=c(t);if(e.length!==0)for(const r of e){const s=r.__uuid,n=this.#t[t.type][s];if(n!=null){const a=r.__bid;let i=Array.isArray(n)?n[0].provider:n.provider;i=i.replaceAll("\\",""),await crs.binding.providers.attrProviders[i].onEvent(t,a,n,r)}}}getIntent(t,e){return this.#t[t]?.[e]}register(t,e,r,s=!1){if(this.#t[t]==null&&(document.addEventListener(t,this.#e,{capture:!0,passive:!0}),this.#t[t]={}),s){this.#t[t][e]||=[],this.#t[t][e].push(r);return}this.#t[t][e]=r}clear(t){const e=crs.binding.elements[t];if(e?.__events==null)return;const r=e.__events;for(const s of r)delete this.#t[s][t]}}function c(o){return o.composedPath().filter(t=>t.__uuid!=null)}export{u as EventStore};
