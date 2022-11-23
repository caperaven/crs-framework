There are a number of button types.

1. primary
2. secondary
3. alternative
4. icon

These are also represented using their css classes of the same name.

<text-editor data-language="html">
<button class="primary">Primary</button>
<button class="secondary">Secondary</button>
<button class="alt">Alternative</button>
<button class="icon">lookup</button>
</text-editor>

**Note :** that the text content of the icon button is the icon name that you want to display.

Additional classes you can add to your buttons are:

1. success - shown as green button
2. error - shown as red button
3. left - flattens the right border of the button
4. right - flattens the left border of the button

The left and right classes are used when you have a toolbar where you have buttons next to each other.  
The left button is rounded on the left border and the right button is rounded on the right side.

To disable a button you just need to add the disabled attribute.