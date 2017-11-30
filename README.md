TagulaBasa
==========


What
----

Add properties to an element for ease of writing Javascript
and a clear separation of concerns (HTML, CSS, JS).


Why
---

Have common tasks available as property-functions, where one
can use the neat dot-notation. Enforce good-practice through
programmatical way of adding content, style and event-listerners.


How
---

After adding this script to the head-element of your doc, instantiate
the TagulaBasa-class upon an element of your choice, it will then be
regarded as the root-element of your app:

```javascript
var tag = document.body
TagulaBasa(tag)
```

Or, don't pass an element, then the body-element is the chosen one.

Furtheron the new peoperties can be used of that element:

```javascript
tag.add()       // Append a child-element with tag-name 'div'.
tag.add('h2')  //  Append a child-element with tag-name 'h2'.
```

The element itself now lives in the ele-property of the tag, of which
you can get it anytime to modify its original props, as usual:


```javascript
tag.ele.tabIndex = 0 // Get element and set tab-index with native prop.
```

Besides of seperation of concerns we can also comfortably walk the tree
in our scripts:

```javascript
tag.up() // go to parent, tag is now parent

tag.down(0)        // go to first child
tag.down('first') // go to first child

tag.down()         // go to last child
tag.down(-1)      // go to last child
tag.down('last') // go to last child
```

Where on each step taken, the ele-property will change to the current
context-ele and provide our extra-properties on the context.

Look into this script, to see all available functions.


Authors
-------

Ida Ebkes <contact@ida-ebkes.eu> 2017


License
-------

MIT, a copy is attached in this folder.