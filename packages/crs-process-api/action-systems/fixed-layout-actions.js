class x{static#t=Object.freeze({left:this.#e,right:this.#i,top:this.#r,bottom:this.#a});static async perform(t,e,i,r){await this[t.action]?.(t,e,i,r)}static async set(t,e,i,r){const a=await crs.dom.get_element(t.args.element,e,i,r),w=await crs.dom.get_element(t.args.target,e,i,r),h=await crs.process.getValue(t.args.point,e,i,r),y=await crs.process.getValue(t.args.at||"bottom",e,i,r),f=await crs.process.getValue(t.args.anchor,e,i,r),b=await crs.process.getValue(t.args.margin||0,e,i,r);a.style.position="fixed",a.style.left=0,a.style.top=0;const l=a.getBoundingClientRect();let s;w!=null?s=w.getBoundingClientRect():s={x:h.x,left:h.x,y:h.y,top:h.y,width:1,height:1,right:h.x+1,bottom:h.y+1};let n=this.#t[y](l,s,b,f);n=this.#h(n,l.width,l.height),a.style.translate=`${n.x}px ${n.y}px`,a.removeAttribute("hidden")}static#e(t,e,i,r){return{x:e.left-t.width-i,y:g(r,e,t)}}static#i(t,e,i,r){return{x:e.left+e.width+i,y:g(r,e,t)}}static#r(t,e,i,r){return{x:o(r,e,t),y:e.top-t.height-i}}static#a(t,e,i,r){return{x:o(r,e,t),y:e.top+e.height+i}}static#h(t,e,i){return t.x<0&&(t.x=1),t.x+e>window.innerWidth&&(t.x=window.innerWidth-e-1),t.y<0&&(t.y=1),t.y+i>window.innerHeight&&(t.y=window.innerHeight-i-1),t}}function g(c,t,e){switch(c){case"middle":return t.top+t.height/2-e.height/2;case"bottom":return t.bottom-e.height;case"top":return t.top}}function o(c,t,e){switch(c){case"middle":return t.left+t.width/2-e.width/2;case"left":return t.left;case"right":return t.right-e.width}}crs.intent.fixed_layout=x;export{x as FixedLayoutActions};
