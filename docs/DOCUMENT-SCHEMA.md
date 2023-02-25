# Proposed Document Schema

*NOTE:* this is just an experimental proposal - I am by no means sure
of it, or even if it a good idea.

We are already having some pressure to have our model schema be available as
data - Scott wants such a thing to drive his TOML serializer.

And notwithstanding my [essay](./CUSTOMIZATION.md) against
user-configurable schema for this sytem, it would also be really nice
if end users could add fields without having to modify the program
source code, while still having things like data validation on load
and save.

So I would propose that:

1) We allow specifying the schema in a configuration file.

2) That we modify the typescript typing, so that while we may require
certain fields for the system to operate, additional user-defined
fields are passed though and available everywhere (easy, becuase we
are just passing around the toml loaded from disk).

3) That we might someday modify the entry editor so that it can edit user
defined fields based entirely on the schema (but that we still want hand-written
editors for the core system).

If we want to do this, we need to choose how to represent the schema.

There is an existing format for this kind of thing:
[json-schema](https://json-schema.org/)

While this format was not designed for our data model (for example, how are
references typed?) - but it probably could be made to work.  It is also a
lot more complicated than we need - our data model is a subset of JSON.  But
this is still a possible choice.

But another choice that I am interested in is representing the schema
using our own [data model](./DATA-MODEL.toml) (ie .toml, with our
representation restrictions).

The advantage of this is that the data model would then live in our 'database',
and potentially be editable using our GUI tools, synced by our syncer etc.

This seems fun.

As an experiment, I will try and encode this typescript type as a
.toml schema:

```ts
interface Person {
   first_name: string,
   last_name: string,
   width?: number,
   enemy?: Person,
   parents: Person[],
}
```

The ? annotations after names in the typescript type above mean
optional fields.

Additional information in the .toml version is that the width is an
'integer' (not a ts number) and that the parents list is represented
inline.  Similarly, we could add other features, like length
restrictions, or a set of possible values for an enum type.

This is schema/person-1.toml:

```toml
# first_name: string
[[field]]
id = 10
name = "first_name"
type = "string"

# last_name: string
[[field]]
id = 11
name = "last_name"
type = "string"

# width: Option<integer>
[[field]]
id = 12
name = "width"
type = "integer"
optional = true

# enemy: Option<Person>
[[field]]
id = 13
name = "enemy"
type = "ref"
target_type = "person-1"
optional = true

# parents: Person[]
[[field]]
id = 14
name = "parents"
type = "list"

   # This is an inline definition of Person - it could also
   # be represented by pulling Person out to a new .toml file -
   # but I think inline entities are important so that complex
   # things like schemas can be seen in one block.
   [[field.field]]
   id = 15
   name = "parent_name"
   type = "integer"

   [[field.field]]
   id = 16
   name = "parent_width"
   type = "integer"
```

Yes, the ids here are ugly, but they are required for the proposed
document model (unless that gets voted down).

But the ids are actually very useful for a schema like this.  One of
the major reasons ids exist in the proposed document model is to
provide accurate semantic change diffs.  This is even more important
in a schema.  Concretely, with the ids, if you change the name of the
"parent_width" field to "parent_width_in_ft", it will automatically
know that this is a field rename, rather than a field drop and new
field insert.

Here is what this schema would look like when converted to JSON (and
thereby in core) - not always apparant from looking at the .toml
version:

```json
[
   {
      "id": 10,
      "name": "first_name",
      "type": "string"
   },
   {
      "id": 11,
      "name": "last_name",
      "type": "string"
   },
   {
      "id": 12,
      "name": "width",
      "type": "integer",
      "optional": true,
   },
   {
      "id": 12,
      "name": "width",
      "type": "integer",
      "optional": true
   },
   {
      "id": 13,
      "name": "enemy",
      "type": "ref",
      "target_type": "person-1",
      "optional": true
   },
   {
      "id": 14,
      "name": "parents",
      "type": "list",
      "fields": [
          {
             "id": 15,
             "name": "parent_name",
             "type": "integer",
          },
          {
             "id": 16,
             "name": "parent_width",
             "type": "integer"
          }
      ]
    }
]
```

```

## Meta schema (schema for schema)

The meta schema is used so that the schema instances can be validated (and
can have things like auto-generated editors etc - if we ever go that
far).

The meta schema will need some loading or definition magic for the usual
chicken-and-egg reasons (it is typed by itself).

in file: 'schema/field-1.toml'

```toml
[[field]]
id = 1
name = "name"
type = "string"

[[field]]
id = 2
name = "type"
type = "string"

[[field]]
id = 2
name = "optional"
type = "boolean"

[[field]]
id = 3
name = "target_type"
type = "string"

[[field]]
name = "fields"
type = "list"
target_type = "field-1"
```
