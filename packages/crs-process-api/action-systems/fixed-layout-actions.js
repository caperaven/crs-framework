class x{static#t=Object.freeze({left:this.#e,right:this.#i,top:this.#r,bottom:this.#a});static async perform(t,e,i,r){await this[t.action]?.(t,e,i,r)}static async set(t,e,i,r){const a=await crs.dom.get_element(t.args.element,e,i,r),o=await crs.dom.get_element(t.args.target,e,i,r),n=await crs.process.getValue(t.args.point,e,i,r),f=await crs.process.getValue(t.args.at||"bottom",e,i,r),u=await crs.process.getValue(t.args.anchor,e,i,r),b=await crs.process.getValue(t.args.container||document.body,e,i,r),d=await crs.process.getValue(t.args.margin||0,e,i,r);a.style.position="fixed",a.style.left=0,a.style.top=0;const l=a.getBoundingClientRect(),g=b.getBoundingClientRect();let s;o!=null?s=o.getBoundingClientRect():s={x:n.x,left:n.x,y:n.y,top:n.y,width:1,height:1,right:n.x+1,bottom:n.y+1};let c=this.#t[f](l,s,d,u);c.x-=g.left,c.y-=g.top,c=this.#n(c,l.width,l.height),a.style.translate=`${c.x}px ${c.y}px`,a.removeAttribute("hidden")}static#e(t,e,i,r){return{x:e.left-t.width-i,y:w(r,e,t)}}static#i(t,e,i,r){return{x:e.left+e.width+i,y:w(r,e,t)}}static#r(t,e,i,r){return{x:y(r,e,t),y:e.top-t.height-i}}static#a(t,e,i,r){return{x:y(r,e,t),y:e.top+e.height+i}}static#n(t,e,i){return t.x<0&&(t.x=1),t.x+e>window.innerWidth&&(t.x=window.innerWidth-e-1),t.y<0&&(t.y=1),t.y+i>window.innerHeight&&(t.y=window.innerHeight-i-1),t}}function w(h,t,e){switch(h){case"middle":return t.top+t.height/2-e.height/2;case"bottom":return t.bottom-e.height;case"top":return t.top}}function y(h,t,e){switch(h){case"middle":return t.left+t.width/2-e.width/2;case"left":return t.left;case"right":return t.right-e.width}}crs.intent.fixed_layout=x;export{x as FixedLayoutActions};
