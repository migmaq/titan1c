# THIS IS VERY MUCH A WORK IN PROGRESS

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



## Using Git for revision control: working dir method






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



```
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






