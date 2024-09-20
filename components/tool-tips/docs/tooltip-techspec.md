# Tooltips component technical spec

## Introduction
This component is used to display a tooltip when a user hovers over an element. 
The tooltip is a small pop-up box that appears when a user hovers over an element or clicks on it. 
It provides additional information about the element or its function.

## Usage
The tooltip is driven using binding event messaging system.

You can show the tooltip at a particular location, for example,
```js
crsbinding.events.emitter.emit("tooltip", {
    "action": "show",
    "tooltip": "Some message",
    "point": {x: 100, y: 100}
})
```

You can also show the tooltip above a reference element, for example,

```js
crsbinding.events.emitter.emit("tooltip", {
    "action": "show",
    "tooltip": "Some message",
    "element": someElement
})
```

If you call show, the current tooltip will be "destroyed" and replaced with the new.
If you are done with the tooltip you need to close it by setting the action to "hide", for example,

```js
crsbinding.events.emitter.emit("tooltip", {
    "action": "hide"
})
```

## Positioning
If a point is sent then it will be placed at the point location so that the tooltip's bottom left corner is at that location.
If you use a reference element the tooltip will be placed in the middle of the reference element but above it.

In all cases the tooltip placed so that is fits on screen.

NB: use process api fixed-layout to ensure that the tooltip is placed correctly.

## Tooltip Content
The tooltip can be either text or a HTMLElement.
If the tooltip is text then the textContent property of the tooltip container element is set.
If the tooltip is a HTMLElement the element is appended to the container element.

