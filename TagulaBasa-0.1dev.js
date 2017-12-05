/*

TagulaBasa-0.1dev
=================


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
    tag = new TagulaBasa(tag)
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
 
TagulaBasa.prototype.down = function(pos=-1) {
  // Switch context to child at position.
  // Defauts to last child, assuming most common case
  // is to walk down after appending an ele.
  // If you want to grab the first child,
  // pass zero or 'first' as pos.
  if( String(pos).startsWith('-') ) {
    pos = this.ele.children.length + pos
  }
  this.ele = this.ele.children[pos]
}

TagulaBasa.prototype.nxt = function() {
  // Get next sibling-ele, if there is none, return null.
  this.ele = this.ele.nextElementSibling
}
TagulaBasa.prototype.prv = function() {
  // Get previous sibling-ele, if there is none, return null.
  this.ele = this.ele.nextElementSibling
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

TagulaBasa.prototype.add = function(tagName='div', pos=-1) {
  // Add ele in current ele at position and return ele-tag-obj.
  var tag = this
  var ele = document.createElement(tagName)
  var nextSibling = null // if no sibling found, insert ele as last child
  var childrenAmount = 0 // default to 0, if children are undefined
  if(this.ele.children !== undefined) { // otherwise count children
    childrenAmount = this.ele.children.length
  }
  if(pos < -1 && childrenAmount > 0) { // negative position was passed
    pos = childrenAmount + 1 + pos // get positive equivalent
    if(pos < 0) pos = 0 // pos exceeds childrenAmount, default to first child
    nextSibling = this.ele.children[pos]
  }

  this.ele.insertBefore(ele, nextSibling)

  tag.down(pos)
  return tag
}

TagulaBasa.prototype.adds = function(returnItemsFuncNameOrItemsArray) {
  // Create list-element, fill it with passed items and return list-element.
  // Passed items can be an array or a function which returns an array.
  var items = returnItemsFuncNameOrItemsArray
  if(typeof(items) == 'function') {
    items = items()
  }
  var ele = this.add('ul')
  this.down() // switch context to list
  for(var i in items) {
    this.add('li')
      this.down()
      this.txt(items[i])
    this.up()
  }
  this.up() // return to old context, the list-parent
  return ele
}

/*
 *
 *  Text
 *
 */ 

TagulaBasa.prototype.txt = function(text=null) {
  // Get text of ele: `var text = tag.txt()`
  // Set text of ele: `tag.txt('Some text')`
  // Works for eles of type input as well as for ordinary eles.

  // No text was passed, return current text:
  if(text === null) {
    // If the ele has value-property it is of type input:
    if(this.ele.value !==  undefined) {
      return this.ele.value
    }
    // Otherwise it's an ordinary element, get its text:
    return this.ele.innerHTML    
    //  (We use innerHTML because it's cross-browser-compatible and
    //  allthough the text shouldn't contain html, it could anyways,
    //  but then we wanted to know about it, too.)
  }
  // Text was passed, insert it:
  else {
    // For input-eles:
    if(this.ele.value !==  undefined) {
      this.ele.value = text
    } // Everyone else:
    else this.ele.innerHTML = text
  }
}

/*
 *
 *  Listen
 *
 */ 

TagulaBasa.prototype.eve = function(eventName, functionName) {
  // Bind execution of a function to an event:
  // `tag.eve(eventName, functionName)`
  this.ele.addEventListener(eventName, functionName, false)
}
TagulaBasa.prototype.click = function(functionName) {
  // Short for: `tag.eve('click', functionName)`.
  this.eve('click', functionName)
}

/*
 *
 *  Script
 *
 */

TagulaBasa.prototype.addScriptEle = function() {
  var context = this.ele
  while(this.ele.tagName.toLowerCase() !== 'html') {
    this.up()
  }
  this.down()
  this.scriptEle = this.add('script')
  this.ele = context
}
TagulaBasa.prototype.script = function(script) {
  if(this.scriptEle === undefined) this.addScriptEle()
  this.scriptEle.innerHTML += script
}

