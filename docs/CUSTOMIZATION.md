
## Customization by enabling and configuring optional features




## Customization by configuring generic fields

- every entry can have an 'attrs' list, with a set of attr names and types defined as configuration data.
- we can have extension fields - for example 'field1' in various places, that are enabled and provided with
a UI prompt in the configuration data.

## Customization using the configuration editing UI


## Customization with hand-edited configuration data

Writing and maintaining configuration editors is quite a bit of work.
For less common configuration, users can edit the .toml configuration
directly (including multi-line strings containing templates etc).
This can be done over the web using a browser-based editor if desired.

## Customization using JS in the configuration data (including templates with JS expressions)

I would like to allow configuration data (both templates and
configuration files) to contain javascript code.

This is likely contentious.

There is a huge variation in human languages, and allowing things like search
preprocessing, page templates, queries etc to be customized with Javascript
snippets will considerably extend the range of the system (without us having
to invent custom languages).

To do this safely in a hosted situation, there are 3 ways we can
reduce the risk of this: a user account per project, use Deno built in
sandboxing (which may well be as safe as that in Chrome) and something
like a FireCracker MicroVM.  Using all three would probably be
sufficiently paranoid.  Because the published system is a static site,
no sandboxing is required for use of the published dictionary.  The
builder is not active much of the time, and these overheads probably
won't be a problem.

User JS code can be also passed though to the published static site (for example
search preprocessing - the search is done in on-page JS).  (A subdomain per site
might be nice cross-site protection in this case).

## Subclassing top level of system

Any verb in dog language can optionally be prefixed with one of the following:

fd: because of food
wg: was a good thing to do
wb: was a bad thing to do

The verb chase is spelled "woofy" in dog lang.

So if someone looks up wgwoofy (as in "wgwoofy squirrel"), the
dictionary should know to show the verb "woofy".

Assuming we have no builtin configuration for prefix stripping, you
could subclass the entire dictionary builder software by creating a
'dog_dictionary.ts' file like this:

``` ts
import {DictionaryProject} from 'https://titan1c.org/titan1c@1.0/dictionary.ts';

export class DogDictionaryProject extends DictionaryProject {}
export namespace MyDictionaryProject {
   export class Search extends DictionaryProject.Search {
      expand_search(search: string): string[] {
         return [search, search.replace(/^(sq)|(wg)|(wb)/, '')]
      }
   }
}

if (import.meta.main)
  new DogDictionaryProject().cli();
```
(Note: I have not run that code - it is just a sketch).

Then run it as follows (note that this is EVERY step that is required - you could buy
a new computer at the store, and run these steps and you would have a working, customized
dictionary builder).

``` sh
# Install Deno
$ curl -fsSL https://deno.land/x/install/install.sh | sh

# Run the locally created 'dog_dictionary.ts'
$ deno run -A dog_dictionary.ts
Created skeleton for new dictionary './dictionary'
Dictionary editor for './dictionary' is running on localhost:8080
```

## Support for long lived forks that follow upstream

I would like to structure the code so that long lived forks are as as
trouble free as possible.

For example, I would like to keep the 

## Hard fork

- I would like to give users as many options as possible to avoid hard
forks, so that they can continue to benefit from (and potentially
contribute) enhancements to the mainline project.
