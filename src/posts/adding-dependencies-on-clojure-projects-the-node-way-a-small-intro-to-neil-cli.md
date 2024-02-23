---
title: "Adding Dependencies on Clojure Projects the Node Way: A Small Intro to neil CLI"
date: 2023-11-29
tags:
    - clojure
    - babashka
    - showcase
    - tutorial
published: true
---

One of the things that I found really hard when starting with Clojure is handling dependencies. I come from a PHP and JS background so `composer` and `npm` were the standard to me. I also worked with some Ruby projects, and `gem` is also cool.

They all have something in common: a way to remove/add dependencies by simply using a command followed by the name of the package. Like in npm:

```bash
# latest version
npm install package-name

# specific version
npm install package-name@version
```

## The Clojure Way

If you find yourself trying to add a dependency on a Clojure project you will find yourself having to copy and paste the dependency "token" to a `deps.edn` or `project.clj` or the maven way.

If you take a look a [this library](https://github.com/clojure/core.match) which is an "official" library you will find three snippets of code for adding the dependency to your project and some with a very strange syntax.

After doing that, the next time you open your project or REPL clojure will download the dependencies for you.

## The neil Way

Recently, doing my Clojure repository searching for studying purposes (or CRSSP for short) I stumbled on this very underrated and not much used in tutorial CLI helper for `deps.edn` Clojure projects called [neil](https://github.com/babashka/neil).

neil is:

> A CLI to add common aliases and features to deps.edn-based projects.

Created by the same guy who created [babashka](https://github.com/babashka/babashka) which is a way to write bash scripts, node scripts, and even apple scripts using Clojure. A very proficient and influential developer in the Clojure community. This is how [borkduke](https://twitter.com/borkdude)'s neil helps us:

```bash
neil add dep com.stuartsierra/component
```

And done. The dependency was added to `deps.edn`. Automatization wins again!

## Neil is the Way!

So neil has a bunch of other features like project scaffolding, building, testing, adding license, etc. I really recommend you take a deep look at the [repository](https://github.com/babashka/neil) and learn all the automatized possibilities that neil adds to your project.


## Thanks!

In closing, I hope this introduction to the neil CLI was helpful in simplifying your Clojure dependency workflow. A big thank you to the developers behind neil for creating a tool that streamlines common tasks. Please feel free to reach out if you have any other questions about using neil in your own projects.

- 🌐 **Website:** [bop.systems](http://bop.systems/)
- 📧 **Email:** [brunooliveira37@hotmail.com](https://mailto:brunooliveira37@hotmail.com/)

📱 **Social Media:**

*   [Twitter](https://twitter.com/original_bop)
*   [LinkedIn](https://www.linkedin.com/in/bruno-oliveira-de-paula-7175699a/)
*   [GitHub](https://github.com/brunoti)
*   [dev.to](https://dev.to/bop)

_You can also [buy me a coffee](https://www.buymeacoffee.com/bopdev) to support me, if you like what I do_
