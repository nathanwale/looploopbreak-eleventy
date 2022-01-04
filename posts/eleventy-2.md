---
title: Eleventy, part 2
date: 2022-01-04
tags: 
    - eleventy
    - site-generation
summary: More thoughts on using the static site generator <a href="https://www.11ty.dev/">Eleventy</a> to make this blog.
---

[Previously](/posts/eleventy/), on Loop Loop break...

This site is built in [Eleventy](https://www.11ty.dev/). In the last post I wrote about my rationale for choosing it, and some thoughts on static site generators. Now I've had a bit more time with it, and wanted to flesh out my thoughts a little.

## Deployment

This site is hosted on [Netlify](https://www.netlify.com/). Netlify allows you to connect a GitHub repo to your site, and automatically deploy when the main branch is updated.

There are [a bunch](https://jamstack.org/generators/) of site generators that Netlify will automatically pick up and build for you.

I also have a [React demo](https://llb-match-three-react.netlify.app/) that is deployed to a different Netlify site. When it's pushed to the repo, the React project is automatically built.

Pretty good so far.

## Static assets

Two options for your stylesheets, images, fonts, etc.:

1. Edit them directly in `_site/` (or whichever build directory you have configured). In which case you'll have to add that directory to source control.
2. Edit `eleventy.js` and add a `eleventyConfig.addPassthroughCopy(...)` to whatever directory you want to copy through to the final build.

If you go with the second option you will also want a `eleventyConfig.addWatchTarget(...)` and run the Eleventy dev server with `--watch`. Otherwise your changes won't be copied through automatically when you change your CSS or whatever.

Easy enough, but it almost feels like handling of CSS and Images were an after-thought. A bizarre choice for a static site generator, I would think. Maybe Eleventy does need a default config file where you can specify which directories get passed through. Punting it to the same mechanism where you write and register custom tags, etc (`.eleventy.js`), makes it more complicated than it should be.

Pass-through file copying is detailed [here](https://www.11ty.dev/docs/copy/).

## Tags
Tags are implemented by ~~abusing~~ taking advantage of Eleventy's [pagination system](https://www.11ty.dev/docs/pagination/).

### An example of paging
From [the docs](https://www.11ty.dev/docs/pagination/#aliasing-to-a-different-variable):
{%raw%}```
---
pagination:  
    data: testdata  
    size: 1  
    alias: wonder
testdata:  
    - Item1  
    - Item2
permalink: "different/{{ wonder | slug }}/index.html"
---
```{%endraw%}

`testdata` above is a list of things we're going to paginate through. This is specified in `pagination.data`. `size` is how many items in each "chunk" — which is the items per page, I think.

This way you can reference the paginated items using `pagination.items[0]` which is the key to look up the current `testdata` item according to the permalink. To reference the current paginated item you can reference it with `testdata[pagination.items[0]]`. Note that the index is always 0. Why? I dunno. In my testing the array is always size 1, so I'm not sure why it's not called `pagination.key` or something.

Luckily you can alias `pagination.items[0]` to something else with `pagination.alias`. In the above example it's aliased to `wonder`, allowing the `permalink` to reference the key more succinctly.

### Pagination ⇒ Tags
It's really not obvious how to implement Tags in Eleventy. Luckily I have the Internet and was able to find this [quicktip #004](https://www.11ty.dev/docs/quicktips/tag-pages/) on the Eleventy docs. The fact that I had to search for it says something either about the organisation of the documentation or my patience. Also numbering the quicktips with two leading zeroes is optimistic: there are nine of them.

If we pretend that Tags are just a special implementation of Pagination, then you can implement them as such.

The `collections` object collects all content of your static site and organises it by tag. `collections.all` contains everything. `collections.cake` contains all content tagged as `cake`. You can also reference members of `collections` with a subscript: `collections['cake']`.

If you assign `pagination.data` as `collections`, then you'll be "paging" through all your content, and each "page" will be a tag. `size: 1` because there is only one tag per page. `alias: tag` makes referencing the tag more convenient.

Here's an example that's used on this site:
{%raw%}```
---
layout: "layouts/main.html"
pagination:
    data: collections
    size: 1
    alias: tag
permalink: /tags/{{ tag }}/
---
<h1>Posts tagged “{{ tag }}”</h1>
{% render "post-list.html", posts: collections[ tag ] %}
```{%endraw%}

`tag` is the pagination key. It's then displayed in the header. The content in `collections[tag]` is then passed to the template `post-list.html`, which renders a link to each.

Eleventy needs a more direct and obvious way to implement tags, which are a fairly standard feature of modern sites.


## Templating languages

As I wrote about in the previous post (which you've read), Eleventy defaults to [LiquidJS](https://liquidjs.com/index.html) (when templates have the extension `.html`), but most of its documentation is in [Nunjucks](https://mozilla.github.io/nunjucks/). Why? I can't find an answer.

My guess is that people like Nunjucks better, including the writers of the Eleventy docs. I haven't used either of them extensively, but comparing the documentation of the two I think I can see why. The documentation for Nunjucks is far more comprehensive. This is a sign that Nunjucks is also the more comprehensive product.

### Templating languages are programming languages

But many of them seem tempted to pretend that they're not. They all have datatypes: numbers, strings, lists and maps/dictionaries. All those datatypes have different basic operations: arithmetic, concatenation, indexing, etc. These are the basic ingredients of a program and you are going to need them even if you wish to pretend you're not actually programming.

There's no introduction to the datatypes and their operations in the Liquid docs. [The page for Liquid's operators](https://liquidjs.com/tutorials/operators.html) describes comparators and some logical operators, but no mathematical operators. There is also no mention of how to index an array or map. This leaves you with a lot of guesswork and inferring from examples.

Compare to [Nunjucks' description of expressions](https://mozilla.github.io/nunjucks/templating.html#expressions). That's proper documentation. No wonder Nunjucks seems to be Eleventy's defacto template language, even if it's not blessed by the code.

I may rewrite this site in Nunjucks, but it'd mostly be academic at this point.

## Thoughts on designing static site generators
Most of my grievances with static site-generators come from their opaque nature. When things are explicit, they're much easier to reason about change to suit your needs. When they're implicit, you spend more time hunting down examples and docs. Making things explicit may take more time to set up, but there's less "spooky action at a distance."

Given that, I have a sketch of a tiny language that I think could handle generating **Loop Loop Break** as it is. It's in a kind of pseudo-Python/SmallTalk, just to play around with the idea:

{%raw%}```
# set your output directory
output = "_site/"

# assign a templating language
renderer = Nunjucks

# open or create a cached store of data
data = DataStore "site_data.db"

# watch a file, assign it to `index`
watch 'index.njk' as index:
    render index to: 'index.html'

# watch a file pattern, unpack {name}
watch 'posts/{name}.njk' as post:
    # collect front-matter data
    read post to: data
    render post to: 'posts/{name}.html'

# render tags
for tag in data.tags:
    render 'templates/posts_for_tag.njk'
        with: tag
        to: 'tags/{tag}/index.html'

# copy through static files
watch 'style/*', 'images/*' as file:
    copy file
```{%endraw%}

Why make a new language? I think it gives more flexibility than a straight config file. Things like tags or pagination are pretty hard to generalise in a declarative way. 

Why not use one of them already invented languages? I know a lot of programmers are wary of this idea, but I think it reduces complexity. I'm also a fan of tools that let you directly express solutions in a problem domain. If "site generation" is the problem domain, then I want a language that's designed explicitly for that. 

It also decouples the tool from its implementation. If it's more performant to write it in C or Rust or FORTRAN 77<sup>1</sup>, then you can, without forcing the users of the tool to use that language.

This will most likely remain in the Realm of Unexecuted Ideas, but I wanted to get the idea out, because it was bugging me. There has to be a better way.

Or it's pure hubris on my part. I never claimed to be immune to it.

___
<small>1. FORTRAN 95 got [varying length strings](https://en.wikipedia.org/wiki/Fortran#Conditional_compilation_and_varying_length_strings). That must have been an exciting release.</small>
