# Proposed on disk representation of dictionary (and site) data set

## Sample site data file layout

Here are example filenames for a site with 3 words ("agase'wa'latl",
"agase'wa'toq" and "egiljet") and one site page ("about-us").

```
migmaq/entries/a/agase_wa_latl--C5B5mKYeKNQAHbSKhRK9/entry.toml
migmaq/entries/a/agase_wa_latl--C5B5mKYeKNQAHbSKhRK9/recording-c519671596cbd25461fa9ae7c229f034.wav

migmaq/entries/a/agase_wa_toq--9234829134829838SDD33/entry.toml
migmaq/entries/a/agase_wa_toq--9234829134829838SDD33/recording-fa923984232139843299348234838838.wav
migmaq/entries/a/agase_wa_toq--9234829134829838SDD33/example-393984193fad48921734238748478388.wav

migmaq/entries/e/egiljet--CCCKDdaslfkjmaszl833833/entry.toml

migmaq/pages/a/about-us--32984721384234892443842/page.toml
```

This sample site has 2 collections: "entries" and "pages".

Each entity gets its own folder with a .toml file for the entity data
and related files (usually multimedia) as required.  In the complete
version of this model, there are also files to support the versioning
and history mechanism, but I am leaving them out for now.

The intermediate directories (/a/) are called clusters.  Entity
directories are split out into clusters.  Usually the cluster name would
be the first letter of the entity directory name - but it is
configurable per type.

The only purpose of the 'cluster' level is that we can have tens of
thousands of entities per collection, and while modern filesystems can
handle large directories, tools like file finders can choke.
Splitting them up into clusters solves this problem.  Ideally,
entities with a small maximum number of files could elide this level.

For the recordings we are choosing to include the content hash in the
filename.  This means that the content files do not have to
participate in the versioning schemes - which is a tremendous
simplification.  These filenames are typically referenced from the
.toml files.  A garbage collector will eventually be required.

The proposed id scheme for entities is: HUMAN_FRIENDLY_ID "--" GLOBALLY_UNIQUE_ID

An unusual property of the id system is that only the globally unique
part participates in id comparison.  So
"david-ziegler--32984721384234892443842" and
"david-zeigler--32984721384234892443842" would be considered the same
id.

This is a compromise.  If we only used the unique portion - data files
(and filenames) would not be readable by people.

```
recorded_by = "32984721384234892443842"
VS:
recorded_by = "david-ziegler--32984721384234892443842"
```

If we only use the human readable portion, any time someone changed
the id of an entry all references to that entity would be broken, and
there would be no automated way of fixing them.

But yes, it is a bit ugly.


## Sample entry.toml
```toml
[[subentry]]
id = 832
part_of_speech = 'vat'
internal_note = ''
public_note = '''
This *is* a sample
multi-line
note.
'''

[[spelling]]
id = 134
text = 'agnimatl'
variant = 'mm-li'

[[spelling]]
id = 135
text = 'aknimatl'
variant = 'mm-sf'

[[definitions]]
id = 137
definition = 'He/she talks about him/her'

[[glosses]]
id = 141
gloss = 'talk about'

[[glosses]]
id = 191
gloss = 'report of'

[[recording]]
id = 38193
speaker = 'dmm-adlkf234383'
recording = 'recording-c519671596cbd25461fa9ae7c229f034.wav'
variant = 'mm-li'

[[examples]]
id = 138
translation = 'Tom talks about Joseph.'

    [[examples.text]]
    id = 139
    text = "Tuma agnimatl So'sepal."
    variant = 'mm-li'

    [[examples.text]]
    id = 140
    text = "Tuma aknimatl So'sepal."
    variant = 'mm-sf'

    [[examples.recording]]
    id = 139
    speaker = 'dmm-adlkf234383'
    recording = 'example-c519671596cbd25461fa9ae7c229f034.wav'
    variant = 'mm-li'

    [[examples.text]]
    id = 140
    text = "Tuma aknimatl So'sepal."
    variant = 'mm-sf'

[[pronunciation_guide]]
id = 136
text = 'a·gê·ni·ma·dêl'
variant = 'mm-li'

[[alternate_grammatical_forms]]
id = 143
gloss = 'I talk about him/her'
grammatical_form = '1-3'

    [[alternate_grammatical_forms.text]]
    id = 144
    text = 'agnimg'
    variant = 'mm-li'

    [[alternate_grammatical_forms.text]]
    id = 145
    text = 'aknimk'
    variant = 'mm-sf'

[[alternate_grammatical_forms]]
id = 146
gloss = 'I talk about you'
grammatical_form = '1-2'

    [[alternate_grammatical_forms.text]]
    id = 147
    text = 'agnimul'
    variant = 'mm-li'

    [[alternate_grammatical_forms.text]]
    id = 148
    text = 'aknimul'
    variant = 'mm-sf'

[[alternate_grammatical_forms]]
id = 149
gloss = 'he/she talks about me'
grammatical_form = '3-1'

    [[alternate_grammatical_forms.text]]
    id = 150
    text = 'agnimit'
    variant = 'mm-li'

    [[alternate_grammatical_forms.text]]
    id = 151
    text = 'aknimit'
    variant = 'mm-sf'

[[categories]]
category = 'communication--98321123984123'

[[categories]]
category = 'speech--1239841239813'

[[attrs]]
id = 126
attr = 'scientific_name--91237841293229'
value = '...'
```

## Document Model

### Dictionary data is stored using a restricted version of the JSON data model.

The two restrictions are:

- all Objects (dictionaries) have a mandatory 'id' field that is a unique
  within the document (but need not be globally unique across the entire system).
- arrays contain only Objects (never primitives).

Disadvantages:

- The id's everywhere are ugly, do make things more verbose, and
  make it more difficult to hand-edit a file.  This overhead is
  particularly noticeable when the 'child' object has few fields.
  Id generation will be particularly onerous when hand editing a
  file.

Advantages:

- Allows for more accurate description of the difference between
  two documents.  Without id's if someone changes (for example) a
  definition of a word, we cannot distinguish that from deleting a
  definition and inserting another one.  This is useful both for change
  approval and for reconciling changes during resync of a remote clone
  (for example after non-internet connected field data collection).

- Allows any item in the entire dataset to be referenced (for crossreferences
  for example) (even though the ids are local to the document, when combined
  with the document id, they become globally unique ids).

- Makes things like UI tools easier because the data is more regular, and everything
  has an id.

### Relational model equivalence:

While we have chosen a 'document' format for data sovereignty
reasons, the restricted data model can be trivially roundtripped to
an equivalent relational model (dicts become tuples, the ids become primary
keys (when combined with the document id, a foreign key reference is added to the
parent object, and an order field is added).

Thinking about the model this way is useful for design discipline.

But it also gives the user more options for how to process data.
For example, I would like to add a step to the publish process that
creates an equivalent SQLite data base file that can be used by
researchers to do ad-hoc queries (or datalog or whatever).
 





## Globally Unique IDs used thoughout the data model

Propose using nanoid UUID alternative:

https://zelark.github.io/nano-id-cc/

Propose using 20 char nano-ids with this 62 char alphabet
"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

I removed the punctuation characters from the alphabet so id is one visual slug.

Sample id: C5B5mKYeKNQAHbSKhRK9

## Justification for TOML

[Toml Spec](https://toml.io/en/)

- Toml has the same data model as JSON, so while the proposed on disk format is
  Toml - the same data can also be spewed as JSON for tools that don't want
  to parse Toml (or sent as JSON between the client and the server etc).

- Toml is much more human readable (to my eye) than JSON.
  - much nicer complex structures.
  - multi line strings
  - no need to quote key names
  
## Details of representation

- While Toml does not define a key order, we are free to implement our 
  own serializer that uses the conventions and order we want.

- This sample has ids for every element in every array.  This does add verbosity,
  and is a nuisance when editing by hand.  The reason they are (tentatively) proposed
  is that they allow accurate change reporting.   Without ids, you can't (for example)
  tell the difference between editing an exiting spelling, and both deleting an existing
  spelling and adding a new one.

- media is represented with links to a filename in the same directory,
  the filename includes the SHA of the content in the filename.
  (There will have to be GC passes).
  
- large binary files don't play well with git, so if we are using git, they will
  probably have to be in a parallel tree, which is sad.
  
- a proposed id format is human_friendly_id--globally_unique_nano_id

- directories would be labelled with this id format.

The human_friendly part is ignored for key equality.  This makes the format much more
robust when hand edited (the human part will necessarily change sometimes).

### Sample dictionary entry encoded in TOML:

  
### Files for an dictionary entry

```
entries/a/agnimatl--U8S4IrcSb7f13TXy/published-li.toml
entries/a/agnimatl--U8S4IrcSb7f13TXy/published-sf.toml
entries/a/agnimatl--U8S4IrcSb7f13TXy/current.toml
entries/a/agnimatl--U8S4IrcSb7f13TXy/recording-c519671596cbd25461fa9ae7c229f034.wav
entries/a/agnimatl--U8S4IrcSb7f13TXy/example-c519671596cbd25461fa9ae7c229f034.wav
entries/a/agnimatl--U8S4IrcSb7f13TXy/image-c519671596cbd25461fa9ae7c229f034.png
entries/a/agnimatl--U8S4IrcSb7f13TXy/history/2023-10-29_15-12-33_17773_949d3_dziegler__17773f830a466ffba9c126a76a8de8cf_949d33baea2e27d01b65a75cd43f8d29_838123333_18243819adaffsffad.toml
```

### Files for the auto-generated published version of a dictionary entry

```
entries/a/agnimatl--U8S4IrcSb7f13TXy/index.html
entries/a/agnimatl--U8S4IrcSb7f13TXy/recording-c519671596cbd25461fa9ae7c229f034.wav
entries/a/agnimatl--U8S4IrcSb7f13TXy/example-c519671596cbd25461fa9ae7c229f034.wav
entries/a/agnimatl--U8S4IrcSb7f13TXy/recording-c519671596cbd25461fa9ae7c229f034.mp3
entries/a/agnimatl--U8S4IrcSb7f13TXy/example-c519671596cbd25461fa9ae7c229f034.mp3
entries/a/agnimatl--U8S4IrcSb7f13TXy/image-c519671596cbd25461fa9ae7c229f034-200x200.jpg
entries/a/agnimatl--U8S4IrcSb7f13TXy/published-li.json
entries/a/agnimatl--U8S4IrcSb7f13TXy/published-li.toml
entries/a/agnimatl--U8S4IrcSb7f13TXy/published-sf.json
entries/a/agnimatl--U8S4IrcSb7f13TXy/published-sf.toml
```

