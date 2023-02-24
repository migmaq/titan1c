# Why DENO

We are proposing writing the dictionary software in typescript (a
variant of javascript with type annotations) and running the server
and batch processes using the [Deno JS runtime](https://deno.land/).

The Deno runtime model and environment strives to be as close to the
browser model as possible (including sandboxing).

## Using javascript will allow the dictionary builder to be delivered as a phone/table app or desktop app

Because the dictionary builder is written is Javascript, it will be relatively easy to port to:

- Running as
  [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
  will allow running disconnected in web browsers or phones.
- If it desired to get around Apples prejudice against PWA's, one
  could package the dictionary builder using something like [Apache
  Cordova](https://cordova.apache.org/)
- The dictionary builder could also be packaged with something like
  Electron to run as a desktop application.

While this is very much not in the initial plans, it is a very
desirable long term feature for a dictionary builder - field
researchers need to work in situations where they do not have reliable
internet access.

## Deno has typescript support baked in
- for a volunteer project, with multiple contributors working sporadically, typing is critical.

## Javascript is a very popular language with a large community
- it is likely to be supported for a long time.
- Javascript (unlike python) has a language specification and multiple
  widely used fully compatible implementations.

## The whole system can be written in one language
- we have substantial parts of the system that we have to run in the
browser.  Using JS means we will have a single implementation language
(for both code and skills reuse).

## It is Super easy to run Deno projects
- the deno runtime is a single executable file, once the user has downloaded that they can do:

```
$ deno run -A https://titan1c.org/dictionary_builder.tsconfig
```

And you will have a running dictionary editor:
```
Created skeleton for new dictionary './dictionary'
Dictionary editor for './dictionary' is running on localhost:8080
```

(In practice, you would want to use a more restrictive permission
grant than "-A", which disables the sandbox).

## Deno has sufficient Batteries Included
- Deno has sufficient batteries included, especially the big ticket ones
  like a web server, that we can have minimal external dependencies.  Which
  is super important for a long lived project.

## Deno is Sufficiently non-weird that we will be fine if dies
- it would not be a big deal to port to another JS runtime (even node.js)

## Node.js is a trainwreck for long-lived projects
- node.js encourages a style where you have a massive number of
  fragile dependencies, pre-processors, bundlers etc.
- this is particularly problematic for long-lived projects - if you stop
  actively maintaining your dependencies for over 15 minutes on a node.js
  project, it becomes permanently unrunnable (because it is so
  frustrating to resolve that you just give up instead).
- even if Deno dies and we end up porting to node.js - having implemented
  using Deno will have forced us away from this crazy.

