---
title: Custom Elements
date: 2022-03-11
tags: 
    - javascript
    - web components
summary: Creating custom elements for web pages
---

[Custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) are a way to create your own elements for your HTML. Elements that do whatever you want. Elements that are... custom. 

To create a custom element you:

* Define a JS class that extends `HTMLElement`
* Construct a DOM element in its `constructor()`
* Attach a shadow DOM
* Append the element to the shadow DOM
* Register it with `customElements.define`, tying the JS class with an element name. Custom element names **must** [have a dash in them](https://html.spec.whatwg.org/#valid-custom-element-name) (ie. kebab case). I assume this is to prevent old browsers parsing them incorrectly and accidentally invoking old magicks.

## Simple example: A Copyright Notice
```js
class CopyrightNotice extends HTMLElement {
  constructor() {
    super()
    let year = (new Date()).getFullYear()
    let p = document.createElement('p')
    p.textContent = `©1845–${year}, Edgar Allan Poe`
    this.attachShadow({mode: 'open'})
    this.shadowRoot.append(p)
  }
}

customElements.define('copyright-notice', CopyrightNotice)
```

The above script creates the custom element `<copyright-notice>`. Using this tag will produce the HTML:

```html
<p>
	©1845-2022, Edgar Allan Poe
</p>
```

...where the current year, '2022', is generated automatically.

## Accessing attributes
You can also use attributes of custom elements.

Say we extend the custom tag from above:
```html
<copyright-notice author="PoeCorp®">
```

We can then modify our `CopyrightNotice` class to use the `author` attribute.

```js
class CopyrightNotice extends HTMLElement {
  constructor() {
    ...
    let author = this.attributes.author.textContent
    p.textContent = `©1845-${year}, ${author}`
    ...
  }
}
```

Our custom element now produces:

```html
<p>©1845-2022, PoeCorp®</p>
```

## Accessing tag content
You can use `this.textContent`  to get the contents of your custom element.

```js
class AutoLink extends HTMLElement {
  constructor() {
    super()
    let element = document.createElement('a')
    let link_label = this.textContent
    // pretend `slugify` converts to a legit path
    let link_path = slugify(link_label) 
    element.setAttribute('href', `/articles/${link_path}`)
    element.textContent = link_label
    this.attachShadow({mode:'open'})
    this.shadowRoot.append(element)
  }
}

customElements.define('auto-link', AutoLink)
```

Using the custom element:
```html
Please see <auto-link>My guide to custom elements</auto-link> 
I posted earlier...
```

`<auto-link>` will convert to:
```html
<a href='/articles/my-guide-to-custom-elements'>
    My guide to custom elements
</a>
```

## Extending standard elements
You can extend standard HTML elements by passing `{extends: 'elementname'}` as the third parameter of `customElements.define(...)`. You specify elements as being extended by using the `is` attribute of elements. In this way, the above `<auto-link>` can be written as `<a is='auto-link'>`. 

```js
class AutoLink extends HTMLAnchorElement {
  constructor() {
    super()
    let link_label = this.textContent
    let link_path = slugify(link_label)
    this.setAttribute('href', `/articles/${link_path}`)
    this.textContent = link_label
  }
}

customElements.define('auto-link', AutoLink, {extends: 'a'})
```

It can then be used like so:
```html
<a is='auto-link'>My guide to custom elements</a>
```

This produces the same result as `<auto-link>` above. This version of `AutoLink` is a bit shorter to implement, because we don't have to construct an element, we use the one we're extending. However, it might not be as obvious in code that it's a non-standard version of `<a>`. I think I'd prefer `<auto-link>`. It's more explicit and quicker to use.

## Lifecycles of Custom Elements
There are [a few methods](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) that are fired at different times during the lifecycle of an element:

**`connectedCallback`** 
The element has been added to a document.

**`disconnectedCallback`**
The element has been removed from a document.

**`adoptedCallback`** 
The element has been moved to a new document.

**`attributeChangedCallback`**
An attribute of the element has changed. This only affects elements specified by `observedAttributes` as a static get method of the custom element.

MDN has [an example](https://github.com/mdn/web-components-examples/blob/master/life-cycle-callbacks/main.js) on using these callbacks.

## The whole package
You can, of course, use custom elements with `<template>` and `<slot>`. They are all part of [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), which MDN describes as:

> a suite of different technologies allowing you to create reusable custom elements

A suite. Fancy.