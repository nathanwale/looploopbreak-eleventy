---
title: HTML Templates
date: 2022-03-09
tags: 
    - javascript
    - web components
summary: HTML's &lt;template&gt; and &lt;slot&gt;
---

## `<template>`
```html
<template id='notice-template'>
  <header>
    This is a notice. 
  </header>
  <p>
    To acknowledge that you've read and
    understood this notice, please announce
    <b>"I understand"</b> loud enough for 
    the hidden microphones to register 
    your compliance.
  </p>
</template>

<div id='notice' />
```

Without scripting, this will not produce anything. The `<template>` element is hidden from the DOM. If you inspect it in Firefox, you'll see it's been greyed out, and only contains a "document fragment". A [document fragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) isn't an active part of the document tree, so it won't show up until it's inserted into the DOM proper somehow (with `document.appendChild(...)`, for example).

```js
let template = document.getElementById('notice-template')
let notice = document.getElementById('notice')
notice.appendChild(template.content)
```

Now we'll see the contents of the template inserted into `<div id='notice' />`. So far, not particularly useful, unless you want to repeat static content all over your site without copying and pasting.

Which is why we also have `<slot>`.

## `<slot>`
We can specify Slots inside Templates to customise them. Slots can be given names. Elements can then have their `slot` attribute specified. This specifies which `<slot>` the element will replace in the template. 

A `<span slot='user-name'>` will replace a `<slot name='user-name'>`. That element doesn't have to be a `<span>`, you can specify someone's username as being `<img src='velociraptor.jpg'>`. 

Slots can have default values. `<slot name='user-name'>Unknown</slot>` will default to "Unknown". Default values can contain HTML fragments:

```html
<slot name='user-name'>
	<a href='/login'>Please log in</a>
</slot>
```

...would show a log in link when a username isn't supplied.

## An example
Some kind of notice template...

```html
<template id='notice-template'>
  <header>
    <slot name='header'>!!NOTICE HEADER!!</slot>
  </header>
  <slot name='message'>!!NOTICE MESSAGE!!</slot>
</template>

<div id='notice'>
  <span slot='header'>You have now been irradiated</span>
  <p slot='message'>
    You may soon notice certain changes in your morphology.
    It may help your transition if you journal your mutations.
    Self-care is important.
  </p>
</div>
```

Obviously it doesn't do a lot, but it serves well enough to demonstrate. If you apply it to an element that doesn't have elements with slots named `'header'` or `'message'`, they'll display their obnoxious all-caps defaults. 

When the template is applied to `<div id='notice'>`, it replaces the slots with the mapped elements.

None of this happens declaratively, it has to be scripted.

```js
let template = document.getElementById('notice-template')
let notice = document.getElementById('notice')
let shadow = notice.attachShadow({mode: 'open'})
shadow.appendChild(template.content)
```

From my experiments, this only works when attached to a shadow DOM, not a DOM that's already in the document tree. `notice.appendChild(template.content)`  will not fill out the slots.

[Code on codepen.io](https://codepen.io/nwale/pen/bGYyeXe?editors=1011)

## Applications
`<template>` and `<slot>` are designed for use in [custom web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), and you won't find many examples that don't use them in that context.

## What I wish for...
Some declarative way to use Templates. You could imagine setting a `template` attribute on an element, and having it fill itself out. So the example above could be written like so:

```html
<template name='notice-template'>
	...
</template>

<div id='notice' template='notice-template'>
  <span slot='header'>WINNER!</span>
  <p slot='message'>
    Submit your bank account details to receive your prize:
	<input type='text' />
  </p>
</div>
```

Maybe it's coming...

Hopefully Sir TBL is reading this.
