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
can use the neat dot-notation.


How
---

After adding this script to the head-element of your doc, instantiate
the Tag-class upon an element of your choice, it will then be regarded
as the root-element of your app:

  var tag = document.body
  Tag(tag)

Or, don't pass an element, then the body-element is the chosen one.

Furtheron the new peoperties can be used of that element:

  tag.add()  // Add a child-element with tagName 'div'

The element itself now lives in the ele-property of the tag, of which
you can get it anytime to modify its original props as usual:

  tag.ele.tabIndex = 0 // Get element and set tab-index with native prop.

Besides of seperation of concerns we can also comfortably walk the tree
in our scripts:

  tag.up() // go to parent, tag is now parent

  tag.down()          // go to first child
  tag.down(0)        // go to first child
  tag.down('first') // go to first child

  tag.down(-1)      // go to last child
  tag.down('last') // go to last child

Where on each step taken the ele-property will change to the current
context-ele and provide our extra-properties on the context.

Please look below, to see all available functions.

*/

function TagulaBasa(ele=document.body) {

  this.ele  = ele // context-ele, switches when walking the tree
  this.root = ele // reference to uppest ele 

  // Example for adding a prop of an external script:
  // this.style = styleToSheet // expects glob-var 'styleToSheet'

}

/*
 *
 *  Walk
 *
 */
 
Tag.prototype.down = function(pos=0) {
  // Switch context to child at position.
  // Defauts to first child. If you want
  // to grab the last child, pass `-1`
  // as pos-value.
  if( String(pos).startsWith('-') ) {
    pos = this.ele.children.length + pos
  }
  this.ele = this.ele.children[pos]
}

Tag.prototype.up = function() {
  // Switch context to parent-ele.
  this.ele = this.ele.parentNode
}

Tag.prototype.uppest = function() {
  // Switch context to root-ele.
  while(this.ele != this.root) this.up()
}

/*
 *
 *  Create
 *
 */ 

Tag.prototype.add = function(tagName='div', txt=null) {
  var ele = document.createElement(tagName)
  if(txt) ele.textContent = txt
  this.ele.appendChild(ele)
  return ele
}

Tag.prototype.adds = function(returnItemsFuncNameOrItemsArray) {
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
 *  Fill
 *
 */ 

Tag.prototype.txt = function(txt=null) {
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

Tag.prototype.eve = function(eveName, funcName) {
  this.ele.addEventListener(eveName, funcName, false)
}
Tag.prototype.click = function(funcName) {
  this.eve('click', funcName)
}
Tag.prototype.loaded = function(funcName) {
  this.eve('DOMContentLoaded', funcName)
}
