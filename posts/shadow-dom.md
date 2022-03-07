---
title: The Shadow DOM
date: 2022-03-06
tags: 
    - javascript
summary: Why and what-for of the Shadow DOM
---
~~The Shadow DOM is a dark apparition of the regular DOM, symbolising all its darkest desires and the potential for evil even in the noblest hero...~~

The Shadow DOM is a DOM separate from the main DOM of a web page. The Shadow DOM encapsulates its HTML and CSS, so that they don't leak into the rest of the document. Events will still bubble up from the Shadow DOM to the main DOM.

[Dimitri Glazkov explains](https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/) from the distant year of 2011:

>With the exception of SVG [...], today’s Web platform offers only one built-in mechanism to isolate one chunk of code from another — and it ain’t pretty. Yup, I am talking about [iframes](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-iframe-element.html#the-iframe-element "iframe Element as defined by HTML spec"). For most encapsulation needs, frames are too heavy and restrictive.

Here we see the inspiration for the Shadow DOM: encapsulation.

This makes it handy for making components, and, in fact, browsers have been using them for their own components for a long time:

>Think for example of a [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) element, with the default browser controls exposed. All you see in the DOM is the `<video>` element, but it contains a series of buttons and other controls inside its shadow DOM. The shadow DOM spec has made it so that you are allowed to actually manipulate the shadow DOM of your own custom elements. — [MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

This encapsulation means Shadow DOM is a pre-requisite for [WebComponents](https://www.webcomponents.org/introduction).

### The name is wrong, maybe?
In my mind I had this idea that the Shadow DOM was some kind of lightweight version of the main DOM that replicates only some parts of it for performance reasons. I blame this misunderstanding on the name — not my own laziness, the name. Should be called a "Scoped DOM".

Sounds cool, though.

## Anatomy of the DOM of Shadow
A Shadow DOM is made of pieces four:

1. The Host
2. The Tree
3. The Boundary 
4. The Root

They are scattered in far flung places among the realm, and must be re-united to re-create the Shadow DOM.

### The Host
The Shadow DOM is attached to a node of the regular DOM (or *DOM of Light*). The Host is that node.

### The Tree
The DOM tree of the Shadow DOM.

### The Boundary
Where the DOM of Light ends, and the DOM of Shadow begins. The threshold between light and dark. Once you cross over...

Really, what is this? The other things are DOM Nodes and Trees: actual data structures. What is a "boundary?"

Seems that it's entirely conceptual. Like someone drew a diagram with a box around the Shadow DOM to show its encapsulation, and the CEO was like "uhuh, and what's this box called?"

It's The Boundary. Put it on MDN.

### The Root
The base of the Tree. A DOM node in the Shadow DOM.

## Example
### HTML fragment
```html
<h1>
  DOM of Light
</h1>
<div id='shadow' />
```

### Style
```css
body {
  background-color: #999;
}

h1 {
  font-family: sans-serif;
  color: yellow;
}
```

### JS
```js
let el = document.getElementById('shadow')
let shadow = el.attachShadow({mode: 'open'})
let h1 = document.createElement('h1')
h1.textContent = "DOM of Shadow"
shadow.append(h1)
```

The above code attaches a Shadow DOM to `<div id='shadow' />`. It then attaches an `<h1>` element to it. If you look at the CSS, you'll expect all `<h1>`'s to be yellow and sans-serif, and if you look at the example on codepen.io, `<h1>DOM of Light</h1>` is styled as you'd expect.

But `<h1>DOM of Shadow</h1>` is created in the script and attached to a Shadow DOM. The Shadow DOM encapsulates it from style created elsewhere, so the second `<h1>` is bog standard black serif.

[Code on codepen.io](https://codepen.io/nwale/pen/PoOLeQJ)

## Uses
You can see now how the Shadow DOM would be useful for creating components and custom elements. If your site's styling leaked into your components, they could easily become unusable at any time that you make a style update, and you'd be applying loads of special conditions to your site's CSS to fix things.

See? Scoped DOMs.