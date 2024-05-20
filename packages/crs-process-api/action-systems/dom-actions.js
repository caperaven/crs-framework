import"./action-actions.js";class _{static async perform(e,t,a,s){await this[e.action]?.(e,t,a,s)}static async set_attribute(e,t,a,s){(await crs.dom.get_element(e.args.element,t,a,s)).setAttribute(e.args.attr,await crs.process.getValue(e.args.value,t,a,s))}static async set_attributes(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s);for(let r of Object.keys(e.args.attributes))l.setAttribute(r,await crs.process.getValue(e.args.attributes[r],t,a,s))}static async get_attribute(e,t,a,s){const r=(await crs.dom.get_element(e.args.element,t,a,s))?.getAttribute(e.args.attr);return e.args.target!=null&&await crs.process.setValue(e.args.target,r,t,a,s),r}static async batch_modify_attributes(e,t,a,s){const l=await crs.process.getValue(e.args?.add,t,a,s)||[],r=await crs.process.getValue(e.args?.remove,t,a,s)||[];l.length===0&&r.length===0||(l.length>0&&await d(l,"set_attributes"),r.length>0&&await d(r,"remove_attributes"))}static async remove_attribute(e,t,a,s){(await crs.dom.get_element(e.args.element,t,a,s)).removeAttribute(e.args.attr)}static async remove_attributes(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s);for(let r of e.args.attributes)l.removeAttribute(r)}static async add_class(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s),r=await crs.process.getValue(e.args.value,t,a,s);let n=Array.isArray(r)==!0?r:[r];l.classList.add(...n)}static async remove_class(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s),r=await crs.process.getValue(e.args.value,t,a,s);let n=Array.isArray(r)==!0?r:[r];l.classList.remove(...n)}static async set_style(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s);l.style[e.args.style]=await crs.process.getValue(e.args.value,t,a,s)}static async set_styles(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s);for(let r of Object.keys(e.args.styles))l.style[r]=await crs.process.getValue(e.args.styles[r],t,a,s)}static async get_style(e,t,a,s){const r=(await crs.dom.get_element(e.args.element,t,a,s))?.style[e.args.style];return e.args.target!=null&&await crs.process.setValue(e.args.target,r,t,a,s),r}static async set_text(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s);l.textContent=await crs.process.getValue(e.args.value,t,a,s)}static async get_text(e,t,a,s){const r=(await crs.dom.get_element(e.args.element,t,a,s)).textContent;return e.args.target!=null&&await crs.process.setValue(e.args.target,r,t,a,s),r}static async get_element(e,t,a,s){if(e==null)return null;if(e instanceof Element||e instanceof DocumentFragment||e._dataId!=null)return e;if(typeof e=="string")return document.querySelector(e);let l=await crs.process.getValue(e.args.element,t,a,s);const r=await crs.process.getValue(e.args.scope||document,t,a,s);return typeof l=="string"&&(l=r.querySelector(l)),e.args.target!=null&&await crs.process.setValue(e.args.target,l,t,a,s),l}static async create_element(e,t,a,s){const l=await crs.dom.get_element(e.args.parent,t,a,s),r=document.createElement(e.args.tag_name||"div"),n=Object.keys(e.args.attributes||{}),g=Object.keys(e.args.styles||{}),o=e.args.classes||[],y=Object.keys(e.args.dataset||{}),f=Object.keys(e.args.variables||{}),u=await crs.process.getValue(e.args.id,t,a,s);u!=null&&(this.id=u);for(let i of n)r.setAttribute(i,await crs.process.getValue(e.args.attributes[i],t,a,s));for(let i of g)r.style[i]=await crs.process.getValue(e.args.styles[i],t,a,s);for(let i of o)r.classList.add(i);for(let i of y)r.dataset[i]=await crs.process.getValue(e.args.dataset[i],t,a,s);for(let i of f){const w=await crs.process.getValue(e.args.variables[i],t,a,s);r.style.setProperty(i,w)}if(e.args.text_content!=null&&(r.textContent=await crs.process.getValue(e.args.text_content,t,a,s)),e.args.id!=null&&(r.id=e.args.id),e.args.children!=null)for(let i of e.args.children)i.parent=r,await this.create_element({args:i},t,a,s);return l?.content!=null?l.content.appendChild(r):l?.appendChild(r),e.args.target!=null&&await crs.process.setValue(e.args.target,r,t,a,s),r}static async remove_element(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s);l?.parentElement?.removeChild(l),await crsbinding.providerManager.releaseElement(l)}static async clear_element(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s);if(l!=null)for(await crsbinding.observation.releaseChildBinding(l);l.firstElementChild!=null;)l.removeChild(l.firstElementChild)}static async move_element(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s),r=await crs.dom.get_element(e.args.target,t,a,s);await m(l,r,e.args.position)}static async move_element_down(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s),r=l.nextElementSibling;r!=null&&await m(l,r,"after")}static async move_element_up(e,t,a,s){const l=await crs.dom.get_element(e.args.element,t,a,s),r=l.previousElementSibling;r!=null&&await m(l,r,"before")}static async set_css_variable(e,t,a,s){const l=await crs.dom.get_element(e.args.element),r=await crs.process.getValue(e.args.variable,t,a,s),n=await crs.process.getValue(e.args.value,t,a,s);l.style.setProperty(r,n)}static async get_css_variable(e,t,a,s){const l=await crs.dom.get_element(e.args.element),r=await crs.process.getValue(e.args.variable,t,a,s),n=getComputedStyle(l).getPropertyValue(r);return e.args.target!=null&&await crs.process.setValue(e.args.target,n,t,a,s),n}static async set_css_variables(e,t,a,s){const l=await crs.dom.get_element(e.args.element),r=await crs.process.getValue(e.args.variables,t,a,s);for(let n of Object.keys(r)){const g=r[n];l.style.setProperty(n,g)}}static async get_css_variables(e,t,a,s){const l=await crs.dom.get_element(e.args.element),r=await crs.process.getValue(e.args.variables,t,a,s),n=[];for(let g=0;g<r.length;g++){const o=getComputedStyle(l).getPropertyValue(r[g]);n.push(o)}return n}}async function m(c,e,t){if(c==null||e==null)return console.error("both element and parent must exist to move the element");if(c.parentElement.removeChild(c),t==null)return e.appendChild(c);if(t=="before")return e.parentElement.insertBefore(c,e);if(e.nextElementSibling==null)return e.parentElement.appendChild(c);e.parentElement.insertBefore(c,e.nextElementSibling)}async function d(c,e){for(const t of c){const a=t.element,s=t.attributes;await crs.call("dom",e,{element:a,attributes:s})}}crs.intent.dom=_;export{_ as DomActions};
