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

In this model "current.toml", "published-li.toml" etc can be treated as names into
the history model by reading their content and computing the SHA.

This is very much an initial sketch - much more thinking required.

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

A simple field update might look like:

```json
{
  op: 'update_field',
  ref: '3189423',
  field: 'first_name',
  from: 'Dave',
  to: 'David'
}

```

A update to an array, recursively updating a child array might look like:

(this example might be borked, I haven't put much effort into it).

```json
[
  {
     op: 'insert_after',
     ref: '38139421',
     data: {
        id: 7373,
        name: 'David'
     },
  },
  {
    op: 'delete',
    ref: '1341922',
  },
  {
    op: 'update_field',
    ref: '1299233',
    field: 'first_name',
    from: 'Dave',
    to: 'David'
  },
  {
    op: 'update_array_field',
    ref: '331243'
    field: 'examples',
    ops: [
       {
         op: 'delete',
         ref: '1323',
       },
    ]
  }
]
```

## Using Git for revision control: working dir method

Linear git history, approving changes to a word commit the changes.

The directory used for dictionary editing is a working directory with
uncommitted changes.

The directory used for generating the pushed site is a pull of the committed
tip from git.

### Issues with this scheme
- no tracking of changes between commits (if Sally makes a change, then Bob does,
  we will need some on the side mechanism to track this).
- issues with support for remote clones (if we allow multiple committors, with these
  long running checkouts, we are likely to get into situations that regular users
  can't easily recover from).
- if use CLI git, will be in the business of git response parsing (might be solved
  with isomorphic git).
- no obvious way to have separate approval for different orthographies
  (an Migmaq online requirement).

## Using Git for revision control: branch per word that is under edit
- write details here.

## Issue with binary files in git
- putting the media in git should be fine - the total size is manageable, and
  media are seldom updated, so the git limitation that the binary files are
  never garbage collected won't cause too much problem.
- having to clone all the binary data to all users is a bit irritating.
- cloning the binary data to the browser will push browser limits. (if we
  use isomorphic-git)
  
## Other git notes
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

