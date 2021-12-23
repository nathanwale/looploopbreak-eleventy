---
title: Eleventy
date: 2021-12-15
tags: 
    - eleventy
<<<<<<< Updated upstream
---
# Eleventy
When I first set out to build this site, I looked at a bunch of options before deciding on [Eleventy](https://www.11ty.dev/).
=======
    - site-generation
summary: My experience using the static site generator <a href="https://www.11ty.dev/">Eleventy</a> to make this blog.
---


When first building this site, I looked at a bunch of options before deciding on [Eleventy](https://www.11ty.dev/).
>>>>>>> Stashed changes

## Site Generators and Javascript
Eleventy<sup>1</sup> is a static site generator written in Javascript. That worried me a bit, because I have old set biases about the language. A lot of those biases originated from doing server-side dev with JScript (not quite Javascript) on ASP (before .NET) and interfacing with Access (yeah, that one). You know what? We never had a problem with Access, but maybe we were tempting fate a bit.

I do see the worth of JS as a common language for writing extensions (which Eleventy supports), as it's so widely known. There are also much better tools for JS nowadays.

Another concern: some of the other generators I looked at that were written in JS — eg. [Gatsby](https://www.gatsbyjs.com/) — include globs of Javascript in their published sites. That gets away from the regular HTML and CSS I feel is best suited for a static site. If there are no moving parts, why do you need scripting?

You can look at the examples at [gatsbyjs.com/showcase](https://www.gatsbyjs.com/showcase/) and try to view source. 

Line noise. 

I'm a big believer in using the tool best suited for the job. The old [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns), that was big about a decade ago, but may have now fallen out of fashion a bit.

So I was pleasantly surprised to find that Eleventy produces exactly what you expect from the templates and content that you give it.
___
<small>1. Not a real number</small>

## Jekyll and Hugo

I've played around with both [Jekyll](https://jekyllrb.com/) and [Hugo](https://gohugo.io/) before, but found them confusing to get started. Jekyll is [handy for creating GitHub pages](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll), which is something I considered for this site, but in the end decided I need more flexibility.

New projects begin with so much pre-configured material, that it takes a lot more effort to get your head around it and shape it into your own vision. I guess both projects ascribe to [Convention over Configuration](https://en.wikipedia.org/wiki/Convention_over_configuration). I'd rather build from scratch, with flexible and expressive primitives as a language, rather than config files and pre-configured directory layouts. It's much easier to learn something when you build it from scratch. It also results in a much more flexible tool.

Or maybe it just makes me feel smarter.

## Configuration and Convention

The official [getting started guide](https://www.11ty.dev/docs/getting-started/) for Eleventy asks you to...

1. Make a directory for your project
2. Use [NPM](https://www.npmjs.com/) to create an empty `package.json` file
3. Install Eleventy **locally** (thank you for this)
4. Create a template `index.html` and a Markdown file `README.md` with some content.
5. Run the command to build the site
6. Alternatively, run a command to serve a live reload version

That's three files you create. From those three files, your site is generated and appears in `_site/`. There's no `create site` command that generates dozens of files before you start. Just the files you've created in those five steps.

You're not left with a very useful site, obviously. You have to build it out. And that takes time, but I'm not convinced it takes much longer than the Jekyll or Hugo style. You won't have to fight the conventions so much.

### There is some convention though:

- Layout templates go in `_includes/` by default
- Several template languages are supported, but [LiquidJS](https://liquidjs.com) is the default
- Extensions (which you can write in JavaScript) go in `.eleventy.js`

That last one bit me. Wasted a lot of time wondering why an extension wouldn't work, before realising the file name should have a `.` at the start.

## Gotchas
### Template languages in the docs
While the default template language is LiquidJS, much of the examples in the docs are in [Nunjucks](https://mozilla.github.io/nunjucks/). Not sure if this is part of a transition to or away from LiquidJS.

### YAML
Like a lot of static site generators, Eleventy allows you to embed data in the front matter of your pages in [YAML](https://yaml.org/). YAML is weird. I spent far too long trying to work out why my pages tagged as 'post' in the front matter weren't showing up in `collections.post`. Turns out `tags: post test` isn't two different tags. Nor is it a syntax error. It's one tag that's literally `"post test"`. `tags: post, test` produces something similar. `tags: [post, test]` does produce a list. I guess this is a result of trying to avoid requiring quotation marks for strings. Without an obvious way to view tags, that took a long time to debug.

There are about three different ways to specify a list in YAML, but I managed to not pick one of them. YAML claims to be human readable, which is fairly true. But it can also be ambiguous, which is not what you want in a data format.

Eleventy does allow you to attach metadata in [JSON or plain JS objects](https://www.11ty.dev/docs/data-frontmatter/). You can also [configure TOML](https://www.11ty.dev/docs/data-frontmatter-customize/#example-using-toml-for-front-matter-parsing) as the front-matter data format.

### Silent failure
Something common to most of these templating languages is silent failure. If a tag's incorrect, you'll get an error in the console. But if you misspell a variable you won't be told, things just won't render. So you won't know if there is nothing in the list-like object you're iterating through with {% raw %}`{% for ... in ... %}`{% endraw %}, or if you've just misspelt the name of the list.

I wonder if these tools could use a type of console where you can inspect the environment that a page is being loaded in. You could then poke around while your developing and see what data is available to each page and correct things that are missing. It might also aid discovery of features.


### A cranky aside

Why have things like this in your tutorials?

```bash
echo '<!doctype html><html><head><title>Page title</title></head><body><p>Hi</p></body></html>' > index.html
echo '# Page header' > README.md
```

People are going to edit the files in a text editor anyway, and all you've done is introduce new shell commands and syntax that aren't required to use Eleventy. 

## Deployment
`npx @11ty/eleventy` will build a static site you can copy to a server any way you like. 

You can [use the Netlify Dev CLI tool](https://docs.netlify.com/cli/get-started/#run-a-local-development-environment) to both serve a dev version and deploy to a Netlify site.

You can also deploy to [GitHub Pages using actions](https://iamdanielmarino.com/posts/deploying-my-eleventy-site-to-github-pages/).

## Wrap up

I'd recommend it if you want a site generator that produces exactly what you want, as well as being extensible. Unless you have an aversion to installing Node or something.

You can view the Eleventy source-code for this site at github: [github.com/nathanwale/looploopbreak-eleventy](https://github.com/nathanwale/looploopbreak-eleventy) if you're extremely bored.

In the back of my mind is pooling what I'd want in an ideal site generator. It might turn into a blog post in the future. Hopefully it doesn't turn into *Yet Another Static Site Generator*.

(I'd write it in [CobolScript](https://en.wikipedia.org/wiki/CobolScript))