import{getMouseInputMap as o,clientX as h,clientY as n}from"./input-mapping.js";class r{#t;#n;#o;#l;#e;#i;#h;#r=this.#d.bind(this);#a;#u;#s;constructor(t,s){this.#t=t,this.#e=s,this.#n=this.#p.bind(this),this.#o=this.#c.bind(this),this.#l=this.#f.bind(this),this.#t.style.position="fixed",this.#t.style.left=0,this.#t.style.top=0,this.#s=o(),this.#t.addEventListener(this.#s.mousedown,this.#n,{passive:!1}),t.__moveManager=this}dispose(){this.#t.removeEventListener(this.#s.mousedown,this.#n),this.#n=null,this.#o=null,this.#l=null,this.#e=null,this.#i=null,this.#h=null,this.#s=null,this.#r=null,this.#a=null,this.#u=null,delete this.#t.__moveManager,this.#t=null}#m(t){const s=t.composedPath(),i=s[0];return this.#e==null?i===this.#t:i.matches(this.#e)?!0:s.find(e=>e.matches&&e.matches(this.#e))!=null}async#p(t){this.#m(t)!==!1&&(this.#i={x:h(t),y:n(t)},this.#h=this.#t.getBoundingClientRect(),this.#t.style.willChange="translate",document.addEventListener(this.#s.mousemove,this.#o,{passive:!1}),document.addEventListener(this.#s.mouseup,this.#l,{passive:!1}),this.#r(),t.preventDefault(),t.stopPropagation())}async#d(){this.#i!=null&&(this.#t.style.translate=`${this.#h.x+this.#a}px ${this.#h.y+this.#u}px`,requestAnimationFrame(this.#r))}async#c(t){this.#a=h(t)-this.#i.x,this.#u=n(t)-this.#i.y,t.preventDefault(),t.stopPropagation()}async#f(t){document.removeEventListener(this.#s.mousemove,this.#o),document.removeEventListener(this.#s.mouseup,this.#l),this.#i=null,this.#h=null,this.#a=null,this.#u=null,t.preventDefault(),t.stopPropagation()}}export{r as MoveManager};
