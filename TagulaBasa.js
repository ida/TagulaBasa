/*

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

    tag.down()          // go to first child
    tag.down(0)        // go to first child
    tag.down('first') // go to first child

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


*/


function TagulaBasa(ele=null) {
  if(ele===null) ele = document.body // no ele passed, default to body
  this.ele  = ele   // context-ele, switches when walking the tree
  this.root = ele  // reference to uppest ele

  // Example for adding a prop of an external script:
  // this.style = styleToSheet // expects glob-var 'styleToSheet'

}

/*
 *
 *  Walk
 *
 */
 
TagulaBasa.prototype.down = function(pos=0) {
  // Switch context to child at position.
  // Defauts to first child. If you want
  // to grab the last child, pass `-1`
  // as pos-value.
  if( String(pos).startsWith('-') ) {
    pos = this.ele.children.length + pos
  }
  this.ele = this.ele.children[pos]
}

TagulaBasa.prototype.up = function() {
  // Switch context to parent-ele.
  this.ele = this.ele.parentNode
}

TagulaBasa.prototype.uppest = function() {
  // Switch context to root-ele.
  this.ele = this.root
}

/*
 *
 *  Create
 *
 */ 

TagulaBasa.prototype.add = function(tagName='div') {
  var ele = document.createElement(tagName)
  this.ele.appendChild(ele)
  return ele
}

TagulaBasa.prototype.adds = function(returnItemsFuncNameOrItemsArray) {
  // Create list-element, fill it with passed items and return list-element.
  // Passed items can be an array or a function which returns an array.
  var items = returnItemsFuncNameOrItemsArray
  if(typeof(items) == 'function') {
    items = items()
  }
  var ele = this.add('ul')
  this.down(-1) // switch context to list
  for(var i in items) {
    this.add('li', items[i])
  }
  this.up() // switch context back to parent
  return ele
}

/*
 *
 *  Text
 *
 */ 

TagulaBasa.prototype.txt = function(txt=null) {
  // Get text of ele: `var text = tag.txt()`
  // Set text of ele: `tag.txt('Some text')`
  // TODO: Regard input-values and no-text.
  if(txt === null) return this.ele.textContent
  else this.ele.textContent = txt
}

/*
 *
 *  Listen
 *
 */ 

TagulaBasa.prototype.eve = function(eventName, functionName) {
  // Bind execution of a function to an event:
  // `tag.eve(eventName, functionName)`
  this.ele.addEventListener(eveName, funcName, false)
}
TagulaBasa.prototype.click = function(functionName) {
  // Short for: `tag.eve('click', functionName)`.
  this.eve('click', functionName)
}
