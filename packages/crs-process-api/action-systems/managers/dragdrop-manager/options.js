function u(e){return e=e||{},e.dragQuery=e.dragQuery||"[draggable='true']",e.drag=r(e.drag),e.drop=n(e.drop),e}function r(e){return e=e||{},e.placeholderType=e.placeholderType||"standard",e.clone=e.clone||"element",e}function n(e){return e||={},e.allowDrop||="[aria-dropeffect]",e.action||="move",e}export{u as ensureOptions};
