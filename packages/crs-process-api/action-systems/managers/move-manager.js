import{getMouseInputMap as o,clientX as n,clientY as h}from"./input-mapping.js";class r{#t;#h;#o;#a;#e;#i;#n;#r=this.#p.bind(this);#l;#u;#s;constructor(t,s){this.#t=t,this.#e=s,this.#h=this.#d.bind(this),this.#o=this.#c.bind(this),this.#a=this.#f.bind(this),this.#t.style.position="fixed",this.#t.style.left=0,this.#t.style.top=0,this.#s=o(),this.#t.addEventListener(this.#s.mousedown,this.#h,{passive:!1}),t.__moveManager=this}dispose(){this.#t.removeEventListener(this.#s.mousedown,this.#h),this.#h=null,this.#o=null,this.#a=null,this.#e=null,this.#i=null,this.#n=null,this.#s=null,this.#r=null,this.#l=null,this.#u=null,delete this.#t.__moveManager,this.#t=null}#m(t){const s=t.composedPath(),i=s[0];return this.#e==null?i===this.#t:i.matches(this.#e)?!0:s.find(e=>e.matches&&e.matches(this.#e))!=null}async#d(t){this.#m(t)!==!1&&(this.#i={x:n(t),y:h(t)},this.#n=this.#t.getBoundingClientRect(),this.#t.style.willChange="translate",document.addEventListener(this.#s.mousemove,this.#o,{passive:!1}),document.addEventListener(this.#s.mouseup,this.#a,{passive:!1}),this.#r(),t.preventDefault(),t.stopPropagation())}async#p(){if(this.#i==null)return;const t=Math.round(this.#n.x+this.#l),s=Math.round(this.#n.y+this.#u);this.#t.style.translate=`${t}px ${s}px`,requestAnimationFrame(this.#r)}async#c(t){this.#l=n(t)-this.#i.x,this.#u=h(t)-this.#i.y,t.preventDefault(),t.stopPropagation()}async#f(t){document.removeEventListener(this.#s.mousemove,this.#o),document.removeEventListener(this.#s.mouseup,this.#a),this.#i=null,this.#n=null,this.#l=null,this.#u=null,t.preventDefault(),t.stopPropagation()}}export{r as MoveManager};
