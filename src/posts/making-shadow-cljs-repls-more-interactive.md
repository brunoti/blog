---
title: "Making shadow-cljs REPL's More Interactive"
date: 2023-11-21
tags:
    - clojure
    - tutorial
    - terminal
published: true
---
So, if you ever tried to use some REPL you remember to be able to move your cursor not only sideways but also up and down to go trough some history.

On Clojure, this is very important and if you ever used Clojure's CLI you know that we end up with two executables on our machine: `clj and clojure`.

## What is the difference between them?

So if you run `$ clojure` or `$ clj`, both will give you an interactive REPL to use. But they have some different behavior on them. Let's see:

**Using clojure**

![clojure cli running](https://user-images.githubusercontent.com/6011421/284696223-143d23c0-596b-42a6-b19c-3282ca238a26.gif)

**Using clj**

![clj cli running](https://user-images.githubusercontent.com/6011421/284696623-1f509698-ccbe-447d-8c7f-fc46ce4b3c11.gif)

As you can see when using `clj` instead `clojure` all the interactions you see happen with no problem.

## But what's the difference?

Well, clj is using a tool to make it more interactive. This tool is called [rwrap](https://github.com/hanslub42/rlwrap).

[rwrap](https://github.com/hanslub42/rlwrap) stands for "readline wrapper," and it is a utility primarily used to add readline functionality to command-line applications that lack built-in line editing capabilities.

It enhances the user experience by providing features like command history, line editing (such as editing and deleting characters in the input line), and command completion in terminal-based applications that do not inherently support these functionalities.

If we open the `clj` file we will see something like this:

```bash
#!/usr/bin/env bash

bin_dir=/usr/local/Cellar/clojure/1.11.1.1149/bin

if type -p rlwrap >/dev/null 2>&1; then
  exec rlwrap -r -q '\"' -b "(){}[],^%#@\";:'" "$bin_dir/clojure" "$@"
else
  echo "Please install rlwrap for command editing or use \"clojure\" instead."
  exit 1
fi
```

Which, in other words, it's a script that wraps the clojure cli into rlwrap. Got it?

The thing is that `shadow-cljs` doesn't have that helper. So, when using any of the available terminal REPL's, like `node-repl`, it messes up everything and it's very hard to use.

Take a look

![shadow-cljs](https://user-images.githubusercontent.com/6011421/284699495-41c8fec6-8364-4b2e-81e1-69a89c8c8895.gif)

## What's the solution for this?

Based on the `clj` script I added to my PATH the `cljs` script. That does the same thing but tries to find the installed `shadow-cljs` or fall back to the global one.

That's the final script I've been using:

```bash
#!/usr/bin/env bash

local_install=$(realpath ./node_modules/.bin/shadow-cljs)
global_install=/usr/local/bin/shadow-cljs
usable_install=$(if [ -f "$local_install" ]; then echo "$local_install"; else echo "$global_install"; fi)

if type -p rlwrap >/dev/null 2>&1; then
  exec rlwrap -r -q '\"' -b "(){}[],^%#@\";:'" "$usable_install" "$@"
else
  echo "Please install rlwrap for command editing."
  exit 1
fi
```

I've saved it as `cljs` on my PATH. And now I can do this:

![cljs shining](https://user-images.githubusercontent.com/6011421/284700654-7b3cedac-a350-4c52-8eff-61f7554e544a.gif)

## The end

In this article, we have learned how to improve the interactivity of Shadow CLJS REPLs by adding features like cursor navigation and command history. The solution discussed was to wrap Shadow CLJS in the `rlwrap` utility, similar to how the Clojure tool clj works. By using a simple script to launch Shadow CLJS through `rlwrap`, we can now fully enjoy the interactive REPL experience that is crucial for building and testing ClojureScript applications.

- 🌐 **Website:** [bop.systems](http://bop.systems/)
- 📧 **Email:** [brunooliveira37@hotmail.com](https://mailto:brunooliveira37@hotmail.com/)

📱 **Social Media:**

*   [Twitter](https://twitter.com/original_bop)
*   [LinkedIn](https://www.linkedin.com/in/bruno-oliveira-de-paula-7175699a/)
*   [GitHub](https://github.com/brunoti)
*   [dev.to](https://dev.to/bop)

_You can also [buy me a coffee](https://www.buymeacoffee.com/bopdev) to support me, if you like what I do_
