import{getMouseInputMap as r,clientX as l,clientY as o}from"./input-mapping.js";class m{#t;#s;#e;#l;#h=1;#d=1;#p=[];#y=[];#r=this.#x.bind(this);#u=this.#g.bind(this);#c=this.#v.bind(this);#m=this.#z.bind(this);#a;#o;#n;#i;constructor(t,s){this.#t=t,this.#s=t.getBoundingClientRect(),this.#t.__cssGridResizeMananger=this,this.#l=s,this.#i=r()}dispose(){(this.#t.shadowRoot||this.#t).removeEventListener(this.#i.mousedown,this.#r),this.#t.__cssGridResizeMananger=null,this.#t=null,this.#e=null,this.#l=null,this.#h=null,this.#d=null,this.#p=null,this.#y=null,this.#r=null,this.#u=null,this.#c=null,this.#m=null,this.#a=null,this.#o=null,this.#n=null,this.#s=null,this.#i=null}async initialize(){this.#t.style.position="relative",this.#e=await crs.call("cssgrid","get_column_sizes",{element:this.#t}),this.#h=await crs.call("cssgrid","row_count",{element:this.#t}),this.#d=await crs.call("cssgrid","column_count",{element:this.#t}),await this.#f(),await this.#w(),(this.#t.shadowRoot||this.#t).addEventListener(this.#i.mousedown,this.#r,{passive:!1})}async#f(){const t=this.#t;let s=this.#e.map(i=>`${i}px`);s[s.length-1]="1fr",s=s.join(" "),await crs.call("cssgrid","set_columns",{element:t,columns:s})}async#w(){if(this.#l.columns==null){this.#l.columns=[];for(let t=0;t<this.#h;t++)this.#l.columns.push(t)}for(let t of this.#l.columns){const s=a(t,this.#e);this.#p.push(await u(t,s,this.#h,this.#t.shadowRoot||this.#t))}}async#x(t){if(t.target.dataset.type!="resize-column")return;const s=l(t),i=o(t);this.#a={x:s-this.#s.x,y:i-this.#s.y},this.#o={x:s-this.#s.x,y:i-this.#s.y},this.#n=t.target,t.target.style.background="silver",document.addEventListener(this.#i.mousemove,this.#u,{passive:!1}),document.addEventListener(this.#i.mouseup,this.#c,{passive:!1}),t.preventDefault(),this.#m()}async#g(t){this.#o.x=l(t)-this.#s.x-4,this.#o.y=o(t)-this.#s.y-4,t.preventDefault()}async#v(t){const s=l(t),i=o(t),e={x:s-this.#a.x-this.#s.x-4,y:i-this.#a.y-this.#s.y-4},h=Number(this.#n.dataset.column);this.#n.style.background="transparent",document.removeEventListener(this.#i.mousemove,this.#u),document.removeEventListener(this.#i.mouseup,this.#c),this.#n=null,this.#a=null,this.#o=null,t.preventDefault(),await this.#M(h,e)}async#z(){if(this.#n==null)return;const t=this.#o.x;this.#n.style.translate=`${t}px`,requestAnimationFrame(this.#m)}async#M(t,s){let i=this.#e[t]+s.x+4;this.#e[t]=i,await crs.call("cssgrid","set_column_width",{element:this.#t,position:t,width:`${i}px`}),await this.#_()}async#_(){const t=this.#t.querySelectorAll('[data-type="resize-column"]');for(const s of t){const i=Number(s.dataset.column),e=a(i,this.#e);s.style.translate=`${e}px`}}}async function u(n,t,s,i){const e=await crs.call("dom","create_element",{tag_name:"div",styles:{position:"absolute",top:0,bottom:0,left:0,width:"8px",background:"transparent",translate:`${t-4}px 0`,cursor:"col-resize"},dataset:{column:n,type:"resize-column"}});return i.appendChild(e),e}function a(n,t){let s=0;for(let i=0;i<=n;i++)s+=t[i];return s-4}export{m as CSSGridResizeManager};
