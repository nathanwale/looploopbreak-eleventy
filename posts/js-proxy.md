---
title: Javascript Proxies
date: 2022-03-06
tags: 
    - javascript
summary: Using Javascript's Proxy objects
---

## Standard
EcmaScript 6

## Can I Use?
Not if you're on IE

## What is it?
[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) Says:

>The `Proxy` object enables you to create a proxy for another object, which can intercept and redefine fundamental operations for that object.

### Four questions:
1. What are these fundamental operations?
2. Intercept them from what?
3. Redefine them to be what?
4. Why was Proxy added to ES?

## What are these fundamental operations?
Most obviously, getting and setting properties. But also: 

`construct`: Basically creating a new object with `new` 
`defineProperty`: Adding a new property to an object
`deleteProperty`: See above, but imagine it in reverse
`has`: Overwrites the `in` operator

And more, check the sidebar of the [MDN article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

They refer to them as 'traps'. If you don't like this whole Proxy idea, you can make a joke out of that.

## Intercept them from what?
Regular use. Things are too predictable nowadays. Actually, Proxies are defined as separate objects, so they can be used independently of their original source. 

```js
let source_object = {
  value: 9
}
let handler = {
  get(target, prop) {
    return target[prop] * 2 // intercept accessing a property, double it and return
  }
}
let proxy = new Proxy(source_object, handler)
console.log(proxy.value) // 18
```

So I'm not sure if "intercept" really captures what they do. Unless you overwrite the original object in the process of creating the Proxy: 
```js
...
let source_object = new Proxy(source_object, handler)
```
... which you may want to do to ensure there's only one way of using it.

## Redefine them to be what?
Anything that can be defined by a function. Double something's value. Make everything capitalised. Prevent properties from being deleted. Log properties as they're being accessed. Hang your app with an infinite loop. Anything.

## But why though?
Examples from [Brendan Eich's presentation on Proxies](https://www.slideshare.net/BrendanEich/metaprog-5303821) include:

* Logging
* Counting property access
* Being able to revoke access to a property at any time. (They call this a Membrane? Never encountered it before). Final slide says it's the basis for all of Gecko's security wrappers. (That was Firefox 4, like 94 versions ago).

Also, thinking with my own brain:

* Persistence: commit to a DB on set(), retrieve on get(), etc.
* Reactivity: update UI elements on set(). 


## Simple HTML Reactivity
### HTML
```html
<button onClick="clicked()">
  Click this
</button>
<h1>
  You've clicked this button 
  <span id='count'>0</span> times
</h1>
```

### JavaScript function to create refs
```js
/*
** create_ref:
**   - init_value: Initial value of the ref
**   - element_id: ID of the element to bind to. Will set innerHTML of it.
*/

function create_ref(init_value, element_id) {
  let ref = {
    value: init_value,
    element: document.getElementById(element_id)
  }

  let handler = {
    set(obj, prop, value) {
      // only allow assigning to .value
      if (prop === "value") {
        obj[prop] = value
        obj.element.innerHTML = value
        return true 
        // set should return true if a valid assignment is made
      } else {
        // disallow assigning to other elements
        return false
      }
    }
  }
  
  return new Proxy(ref, handler)
}
```

### When you click the button, count goes up
```js
// create the ref
count_ref = create_ref(0, "count")

// our button onClick function increments the ref's value
function clicked() {
  count_ref.value +=1
}
```

### Now you have the beginnings of a React
React probably does some other stuff too, I dunno.

This example is up on [CodePen](https://codepen.io/nwale/pen/ZEaPaEK)

