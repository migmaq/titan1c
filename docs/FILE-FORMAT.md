# On disk representation of dictionary (and site) data set

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

```toml
id = 'U8S4IrcSb7f13TXy'
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
category = 'communication'

[[categories]]
category = 'speech'
```
  
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

### If we use git, we may be forced to use a layout like:

```
data/entries/a/agnimatl--U8S4IrcSb7f13TXy.toml

media/entries/a/agnimatl--U8S4IrcSb7f13TXy/recording-c519671596cbd25461fa9ae7c229f034.wav
media/entries/a/agnimatl--U8S4IrcSb7f13TXy/example-c519671596cbd25461fa9ae7c229f034.wav
media/entries/a/agnimatl--U8S4IrcSb7f13TXy/image-c519671596cbd25461fa9ae7c229f034.png
```

With only the data/ tree in git. (Because of issues with putting lots
of binary files in git).


## Using git for revision control?
- if have to use cli git, will end up doing lots of parsing - which could be 
  a huge, fragile nuisance.
- if use something like
  https://github.com/isomorphic-git/isomorphic-git (git implemented in
  JS, also runs in the browser), then will have API-level access.
  (but, of course, this is a pretty huge and complicated dependency).
- also, git will present diffs at the wrong level (it is not aware of the 
  structure of the file - so will be text based, which is less good)
- the edit merging will also have to be on top of this text level diffing.
- maybe can do our own more content-aware merging on top of this the git api?

## An attempt at a custom revision control scheme.

Each entity would have 2 .toml versions:

```
published-li.toml
published-sf.toml
current.toml
```

If they are the same, there are no unpublished changes.

If they are different, show a semantic difference between them, and:

- for each difference, can reject, which will go back to published version, 
  accept, which will push that difference to the published version, or leave alone.
- can also just edit word (to change, then accept).

Also have a history directory, that contains the recent edit history in the form:

```
2023-10-29_15-12-33_17773_949d3_dziegler__17773f830a466ffba9c126a76a8de8cf_949d33baea2e27d01b65a75cd43f8d29_838123333_18243819adaffsffad.toml
```

- up to the first __ is purely for humans, and is ignored by the system.
- then comes the from_content_SHA, then the to_content_SHA, the editor_id, and the unique edit id.

And this is used to inform the edit display (showing who edited what and so on).

If gets out of sync (because user edits current.toml directly, or weird branches) - just
shows that it is confused, and is OK - this is just an informative system.

When published, it will generate a version in the edit history that corresponds to
the (for example 'accept' operation), then move this to be published-li.

This means will have history to published version.

If current.toml is hand edited, system will generate a 'history' record for it.

If published-li.toml is hand edited???   System will still work, just will have
broken history (and will know that).

ISSUES: 
- sometimes we want multiple approvers.
- sometimes approvers are per locale (ie. a mm-sf approver cannot approve a
  mm-li change)
- approving to two different published versions can allow for separate approvers
  per version.  When doing this can be informed by whether change has been accepted
  to the other version.
- the one approver (per version) is still sad - but maybe OK for now.
- having the history to the published version will allow for subsequent review.


## Entry Diff algorithm
- takes two (JSON) objects, with the restriction that every 'dict', has an id field,
  and that all arrays are arrays of 'dict's.
- generates a difference in the form:

```json
{
  op: 'update',
  ref: '3189423',
  name: { from: 'David', to: 'Dave' },
}

```

For an array, generates:

```json
[
  {
     op: 'insert_after',
     ref: '38139421',
     data: {},
  },
  {
    op: 'delete',
    ref: '1341922',
  },
  {
    op: 'update',
    ref: '1299233',
    name: { from: 'David', to: 'Dave' },
  }
]
```

