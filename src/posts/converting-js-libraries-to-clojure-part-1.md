---
title: "Converting JS Libraries to Clojure: Part 1"
date: 2023-11-20
tags:
    - js
    - clojure
    - clojurescript
    - tutorial
    - learning
published: true
---

## What are we doing here?

This is a series of articles with two purposes: to improve my Clojure and ClojureScript knowledge and to help JavaScript developers learn Clojure.

The first library we will be transforming is [titleize](http://github.com/sindresorhus/titleize). We are starting with the simplest library I could think I ever used and maybe you used too.

Also because [sindresorhus](https://github.com/sindresorhus) has the largest, high-quality, open-source codebase of reusable js/ts snippets and libraries, I've seen.

The recommendation here is not necessarily to use it in a project but to know the basics of Clojure code that can be used on both Clojure and ClojureScript environments. Maybe if you have a Clojure(Script) project you can install this library, but if you just want a `titleize` function in your JavaScript code, just npm install the original one.

## The titleize function

Let's start by digging into the original code. This is the titleize function. It has no dependencies. A very simple
straightforward JavaScript regex shenanigans. Take a look:

```javascript
export default function titleize(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	return string.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, x => x.toUpperCase());
}
```

So the first thing to do is to create this function. I don't want to spend too much your time so let's just fire a REPL
and start doing stuff there. So run this:

`$ clj`

So now on the REPL, you can test some code. Run some sum example like `(+ 1 2)` and make sure you receive `3` and then we
can start.

### String functions

So first let's require Clojure's string standard library with the following code.

```clojure
(require [clojure.string :as string])
```

In the original code, we can see the author using the toLowerCase and toUpperCase methods from JavaScript's string type. The equivalents in Clojure would be:

```clojure
(string/lower-case "BEING DEV IS NICE") ; => being dev is nice
(string/upper-case "being dev is cool") ; => BEING DEV IS COOL
```

Ok. We could also refer to the functions directly.

```clojure
(require [clojure.string :refer [lower-case upper-case]])

(lower-case "BEING DEV IS NICE") ; => being dev is nice
(upper-case "being dev is cool") ; => BEING DEV IS COOL
```

Then we can see on the original implementation that we also have a usage of `replaceAll` with some regex. The
equivalent will also be from `clojure.string` which is the `replace` function.

### Regex

In Clojure, the regex syntax is a little bit different. Of course, it will depend on the application but for now, we will ignore the modifiers (we can see the `/g` on the titleize implementation) and just transform that to our beloved clojure syntax:

**Original:**
```javascript
/(?:^|\s|-)\S/g
```

**Clojure:**
```clojure
#"(?:^|\s|-)\S"
```

Not trusting me? Ok. Make sure you know by yourself then:

```clojure
(type #"") ; => java.util.regex.Pattern
```

### Glueing everything together

Now let's write our function:

```clojure
(require [clojure.string :refer [lower-case upper-case replace]])

(defn titleize [str]
    (replace (lower-case str) #"(?:^|\s|-)\S" upper-case))
```

Done! Run the above on your REPL and then you can use it:

```clojure
(titleize "the quick brown fox jumps over the lazy dog") ; => The Quick Brown Fox Jumps Over The Lazy Dog
```

## Let's refactor it a little

Our code is fine now. It works! But it still doesn't leverage one of the best things Clojure has: macros!

To make our code a little bit more readable and, I would say, better to maintain we will be using the thread first macro. Which can be simply described as:

> The thread-first macro `->` in Clojure allows you to write code in a more sequential and readable manner by threading the output of one function call into the first argument of the next function call. It simplifies nested function calls by enhancing code readability and reducing the need for intermediate variables. This macro assists in composing functions together in a natural left-to-right order, making the code easier to understand and maintain.

By applying that, our code will now look like this:

```clojure
(defn titleize [str]
  (-> str
    (lower-case)
    (replace #"(?:^|\s|-)\S" upper-case)))
```

So pretty! Right? Clojure has a bunch of useful macros.

## Tests

The original library has a very simple test chain, comparing a bunch of strings that we have. The repo uses ava to run the tests. Take a look:

```javascript
import test from 'ava';
import titleize from './index.js';

test('main', t => {
	t.is(titleize(''), '');
	t.is(titleize('unicorns and rainbows'), 'Unicorns And Rainbows');
	t.is(titleize('UNICORNS AND RAINBOWS'), 'Unicorns And Rainbows');
	t.is(titleize('unicorns-and-rainbows'), 'Unicorns-And-Rainbows');
	t.is(titleize('UNICORNS-AND-RAINBOWS'), 'Unicorns-And-Rainbows');
	t.is(titleize('unicorns   and rainbows'), 'Unicorns   And Rainbows');
});
```

For Clojure we have the `clojure.test` library so we just need to copy the test and apply it on Clojure syntax:

```clojure
(ns excelsia.titleize-test
  (:require [clojure.test :refer [deftest is testing]]
            [excelsia.titleize :as titleize]))

(def result-map {"" ""
                 "unicorns and rainbows" "Unicorns And Rainbows"
                 "UNICORNS AND RAINBOWS" "Unicorns And Rainbows"
                 "unicorns-and-rainbows" "Unicorns-And-Rainbows"
                 "UNICORNS-AND-RAINBOWS" "Unicorns-And-Rainbows"
                 "unicorns   and rainbows" "Unicorns   And Rainbows"})

(deftest titleize-test
  (testing "titleize"
    (doseq [[input expected] result-map]
      (is (= expected (titleize/titleize input))))))
```

Now, I'm not going too deep on that, but you can see on the repository that we are running tests both on the Clojure environment and on the Node.js environment to make sure the code works properly both on Clojure and ClojureScript.

## Summary

So we grabbed a very small JS library and ported it to Clojure library compatible with ClojureScript. Tell me your
feedbacks and other small libraries you may want to see converted to Clojure.

## Code

https://github.com/excelsia-dev/titleize

- 🌐 **Website:** [bop.systems](http://bop.systems/)
- 📧 **Email:** [brunooliveira37@hotmail.com](https://mailto:brunooliveira37@hotmail.com/)

📱 **Social Media:**

*   [Twitter](https://twitter.com/original_bop)
*   [LinkedIn](https://www.linkedin.com/in/bruno-oliveira-de-paula-7175699a/)
*   [GitHub](https://github.com/brunoti)
*   [dev.to](https://dev.to/bop)

_You can also [buy me a coffee](https://www.buymeacoffee.com/bopdev) to support me, if you like what I do_
