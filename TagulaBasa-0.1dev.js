/*

TagulaBasa-0.1dev
=================


What
----

Wrap an element into a TagualaBasa-object, which provides properties for most important Javascript-tasks, and switch context to another element, as wished.


Why
---

- Quick prototyping

Not yet realized, but in the backyard:

- Enforce good practice, e.g.: "ele-content must be either text or eles".

- Separation of concerns: After prototyping generate and export an HTML-,
  a CSS- and a JS-file.


How
---

After adding this script to the head-element of your doc, instantiate
the TagulaBasa-class upon an element of your choice, it will then be
regarded as the root-element of your app:


    var tag = new TagulaBasa(document.body)


Or, don't pass an element, then the body-element is the chosen one.

The element itself now lives in the ele-property of the tag, of which
you can get it anytime to modify its original props, as usual:

    tag.ele.tabIndex = 0 // Get element and set tab-index with native-prop.


The tag-object provides properties containing functions, which are applied
upon the element, when executed as shown below.


    // Append a child-element with tag-name 'div' and switch context to child:
    tag.add()

    // Append a child-element with tag-name 'h2' and switch context to child:
    tag.add('h2')

    // Set text in current context-ele:
    tag.txt('Hello again!')

    // Get text of current context-ele:
    var text = tag.txt()

    // Apply an anonymous event-listener on ele:
    tag.eve('onclick', function(eve) {console.log(`clicked ${eve.target}`)} )

    // Apply a named event-listener on ele:
    function doAfterClick(eve) { console.log(`${eve.target} got clicked`) }
    tag.eve('onclick', doAfterClick)

    // For some events there are short-forms, e.g. for click:
    tag.click(doAfterClick)

    // Switch context to parent:
    tag.up()

    // Switch context to first child:
    tag.down('first')

    // Same, same:
    tag.down(0)

    // Switch context to second child:
    tag.down(1)

    // Switch context to last child:
    tag.down(-1)

    // Same, same:
    tag.down('last')

    // Switch context to second-last child:
    tag.down(-2)

    // Switch context to app-ele:
    tag.ele = tag.root


All of these functions are chainable, meaning you can make your code
less readable, as it already is:

    tag.add().txt('1st').up().add().txt('2nd').add().txt('Child of 2nd')


Authors
-------

Ida Ebkes <contact@ida-ebkes.eu> 2017


License
-------

MIT, a copy is attached in this folder.


Last review
-----------

This description was lastly reviewed by a human on May 17th, 2018.

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
  // after appending an ele with `TagulaBasa.add`.
  // If you want to grab the first child,
  // pass zero or 'first' as pos.
  if(pos == 'first') pos = 0
  if(pos == 'last') pos = -1
  if( String(pos).startsWith('-') ) {
    pos = this.ele.children.length + pos
  }
  this.ele = this.ele.children[pos]
  return this
}


TagulaBasa.prototype.nxt = function() {
  // Get next sibling-ele. If there is none, return null.
  this.ele = this.ele.nextElementSibling
  return this
}


TagulaBasa.prototype.prv = function() {
  // Get previous sibling-ele. If there is none, return null.
  this.ele = this.ele.previousElementSibling
  return this
}


TagulaBasa.prototype.up = function() {
  // Switch context to parent-ele.
  this.ele = this.ele.parentNode
  return this
}

TagulaBasa.prototype.uppest = function() {
  // Switch context to root-ele.
  this.ele = this.root
  return this
}

/*
 *
 *  Create
 *
 */ 

TagulaBasa.prototype.add = function(tagName='div', pos=-1) {
  // Add ele in current ele at position, switch tag-context
  // to it, and return tag-object.
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

  this.down(pos)
  return this
}

TagulaBasa.prototype.adds = function(funcOrArrayName) {
  // Create list-element, fill it with passed items, return list-element.
  // Passed items can be an array, or a function which returns an array.
  var items = funcOrArrayName
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
  this.up() // switch context to list-parent
  return this
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
  return this
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
  return this
}
TagulaBasa.prototype.click = function(functionName) {
  // Short for: `tag.eve('click', functionName)`.
  return this.eve('click', functionName)
}

/*
 *
 *  Style
 *
 */
TagulaBasa.prototype.css = function(style) {
  var space = ''
  if(this.styleEle === undefined) {
    var context = this.ele
    this.ele = document.head
    this.add('style')
    this.ele.type = 'text/css'
    this.styleEle = this.ele
    this.ele = context
  } else space = '\n'
  this.styleEle.innerHTML += space + style
}
TagulaBasa.prototype.style = function(style) {
  var selector = this.genCssSelector()
  style = selector + ' {\n' + style + '\n}\n'
  this.css(style)
}

/*
 *
 *  Script
 *
 */

TagulaBasa.prototype.script = function(script) {
  var space = ''
  if(this.scriptEle === undefined) {
    var context = this.ele
    this.ele = document.head
    this.add('script')
    this.ele.type = 'text/javascript'
    this.scriptEle = this.ele
    this.ele = context
  } else space = '\n'
  this.scriptEle.innerHTML += space + script
}

/*
 *
 *  Export
 *
 */
 
TagulaBasa.prototype.download = function(eleOrHtml=null) {
  // Download content of current tag as a file
  // named after the ele's first found className,
  // or its tagName.
  var ele = null
  var fileContent = null
  var fileExtension = 'html'
  ele = this.ele
  if(eleOrHtml instanceof Element) ele = eleOrHtml
  fileContent = ele.innerHTML
  if(ele.tagName.toLowerCase() == 'style') fileExtension = '.css'
  else if(ele.tagName.toLowerCase() == 'script') fileExtension = '.js'
  else fileContent = ele.outerHTML
  var a = document.createElement('a')
  var fileName = ele.className.split(' ')[0]
  if(fileName == '') fileName = ele.tagName.toLowerCase()
  fileName += '.' + fileExtension
  a.setAttribute('download', fileName)
  a.textContent = 'Download'
  a.href = 'data: application/octet-stream; charset=utf-8,'
         + encodeURIComponent(fileContent)
  document.body.appendChild(a)
  a.click()
  a.remove()
}
TagulaBasa.prototype.export = function(fileContent, fileName='index.txt') {
  var a = document.createElement('a')
  a.setAttribute('download', fileName)
  a.textContent = 'Download'
  a.href = 'data: application/octet-stream; charset=utf-8,'
         + encodeURIComponent(fileContent)
  document.body.appendChild(a)
  a.click()
  a.remove()
}
TagulaBasa.prototype.downloads = function() {
  var html = '<html>'
  html += '\n'
  html += '    <head>'
  html += '    <meta charset="utf-8">'
  html += '\n'
  if(this.scriptEle !== undefined) {
    html += '        <script>'
    html += '\n'
    html += this.scriptEle.innerHTML
    html += '\n'
    html += '        </script>'
    html += '\n'
  }
  if(this.styleEle !== undefined) {
    html += '<style>'
      html += this.styleEle.innerHTML
    html += '</style>'
  }
  html += '    </head>'
  html += '\n'
  html += '    <body>'
  html += '\n'
  this.uppest()
  html += this.ele.innerHTML.trim()
  html += '\n'
  html += '    </body>'
  html += '\n'
  html += '</html>'
  //this.expo(html)
  this.download(html)
}
TagulaBasa.prototype.genCssSelector = function(includeSiblings=false) {
  var i = 1
  var ele = this.ele
  var eleCurrent = null
  var selector = ''
  while(ele.tagName.toLowerCase() != 'body') {
    eleCurrent = ele
    while(ele.previousElementSibling !== null) {
      i += 1
      ele = ele.previousElementSibling
    }
    ele = eleCurrent
    selector = ' > ' + ele.tagName.toLowerCase() + ':nth-child(' + i + ')' + selector
    i = 1
    ele = ele.parentNode
  }

  selector = 'body' + selector
  if(includeSiblings === true) {
    selector = selector.split(':').slice(0, -1).join(':')
  }
  return selector
}
TagulaBasa.prototype.genJsTreeSelector = function() {
  var ele = this.ele
  var eleCurrent = null
  var i = 0
  var selector = ''
  while(ele.tagName.toLowerCase() != 'body') {
    eleCurrent = ele
    while(ele.previousElementSibling !== null) {
      i += 1
      ele = ele.previousElementSibling
    }
    ele = eleCurrent
    selector = '.children[' + i + ']' + selector
    i = 0
    ele = ele.parentNode
  }
  selector = 'document.body' + selector
  return selector
}

