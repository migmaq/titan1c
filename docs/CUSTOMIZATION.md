# Customization of the dictionary

This could look like a long design document for a complex set of
features.

Instead it is meant to be read as an alternative to a much more complex
feature - end user configurable dictionary schema.

The current dictionary project, and the first attempt at a successor
were based on a configurable dictionary schema, with the dictionary
editor configured by this schema (SIL Toolbox, and the now abandoned
predecessor to this system).

The issues with fully configurable schema are:

- Because the dictinary editor is automatically generated from the
  schema, it is necessarily generic - and is not as usable as one that
  was hand tuned to the model.
  
- Most fields require custom code anyway to present and search them nicely, 
  limiting the benefit.

- Other than for simple field additions or removals, schema evolution
  once you have collected data is very difficult.

## Talk to linguists first to try and make as universal an initial model as possible.

In process.

## Customization by enabling and configuring optional features

The base system can be the union of all the features we implement for
all the language models we support.  When a feature is disabled, it
will not be visible in the UI or the at-rest data model (the .toml
files).

For example MikMaq Online needs support for all language text to be
specified in multiple orthographies.  If this feature was disabled,
the multiple orthography UI would disappear (though it would still
have some presence in the data model - the data model would
fundamentally support multiple orthographies).

Even things like revision control might be disablable.  For a single
person project, it might be needless complexity

## Customization by configuring generic fields

We can implement lightweight generic extension data system like:

### Attrs section on each lexeme

Every entry can have an 'attrs' list, with a set of attr names and
types defined as configuration data.

This feature is used in the updated MikMaq Online, and made the model
much nicer.  There were a large number of seldom used, obscure
attributes in the original - turning these into attrs was a big
improvement.

### Extension fields that are named in the configuration data

We can have extension fields - for example 'field1' in various places,
that are enabled and provided with a UI prompt in the configuration
data.

## Customization using the configuration editing UI

Common configuration, like editing enum values and enabling features
should have UI so that it can be edited by non-technical users.
(which will in turn update the .toml files that we are using for all
our data).

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

## Subclassing top level of system (including data model)

Any verb in dog language can optionally be prefixed with one of the
following:

- *fd*: because of food
- *wg*: was a good thing to do
- *wb*: was a bad thing to do

The verb chase is spelled "woofy" in dog lang.

So if someone looks up wgwoofy (as in "wgwoofy squirrel"), the
dictionary should know to show the verb "woofy".

Assuming we have no builtin configuration for prefix stripping, you
could subclass the entire dictionary builder software by creating a
'dog_dictionary.ts' file like this:

``` ts
import {DictionaryProject} from 'https://titan1c.org/titan1c@1.0/dictionary.ts';

export class DogDictionaryProject extends DictionaryProject {}
export namespace DogDictionaryProject {
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
```

Output would be:
```
Created skeleton for new dictionary './dictionary'
Dictionary editor for './dictionary' is running on localhost:8080
```
## Reduce configuration points in order to add a new field

At the minimum you will need to add it to some sort of schema definition, 
to the editor, and to a word template.

The data files on disk are in a regular format that parses to JSON,
and most of the internal processing treats them as a generic format.
This reduces change points for adding to the schema.

## Support for long lived forks that follow upstream

I would like to structure the code so that long lived forks are as as
trouble free as possible.

For example, I would like to keep the 

## Hard fork

I would like to give users as many options as possible to avoid hard
forks, so that they can continue to benefit from (and potentially
contribute) enhancements to the mainline project.
