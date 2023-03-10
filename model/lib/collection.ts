import * as posix from "https://deno.land/std@0.148.0/path/posix.ts";
import * as document from "./document.ts";
import { parse, stringify } from "https://deno.land/std@0.177.0/encoding/toml.ts";



// TODO: finish this standalone collection type.

/**
 * To reduce coupling, while a Db is comprised of multiple
 * Collections, the Collection type is independent of a Db.
 */

/**
 * An Collection base class that is not parameterized by the collection
 * type.
 *
 * This is an internal type that reduces the complexity of the Db and
 * transaction code.
 */
export abstract class CollectionI {
    root_dir: string;
    
    constructor(root_dir: string) {
        this.root_dir = root_dir;
    }

    async load(): Promise<void> {
        // Note: typescript does not allow abstract async functions.
        throw new Error("load() implemenation missing");
    }
}

/**
 *
 */
export class Collection<T> extends CollectionI {
    items_by_id: Map<string,T> = new Map();
    items: T[] = [];

    constructor(root_dir: string) {
        super(root_dir)
    }
    
    async load(): Promise<void> {
        // --- Load all the toml from the collection tree (paired with filename)
        const raw_items: [string, any][] = await load_collection_raw(this.root_dir);

        // --- Preprocess loaded items
        for(const [filename, data] of raw_items) {

            // --- Add the item id (that came from the container) to the
            //     entity itself.
            // XXX this is wrong, and we are planning to put the ide in the entries anyway
            //data['id'] = posix.basename(filename);

            // --- TODO: do some validation here?
            
            // --- Deep freeze all data item (making them immutable so they can
            //     be shared without worrying that someone will mute them).
            document.deepFreeze(data);
        }        

        // --- Build items-by-id map
        this.items_by_id = new Map(raw_items);

        // --- Build items list
        this.items = raw_items.map(([filename, data]) => data);
    }
}

/**
 *
 * 
 * TODO: allow child id lookups.
 * TODO: add errors on pk conflict
 * TODO: start doing lazy thing
 * TODO: Set to confirm object is in items.
 */
export class CollectionSnapshot<T> {
    items: T[];
    items_by_id: Map<string, T>;

    constructor(collection: Collection<T>) {

        // XXX HACK TO COOK ITEMS (SO WE CAN GET TEMPLATES TO GO WHILE
        //     WE ARE STILL EVOLVING MODEL)
        // XXX real model is too hard to do today.
        // let items_by_id = new Map<string, T>();
        // This is too slow to do for real (like 200ms on my loaded machine
        // with a 6,500 word dictionary load.
        // XXX THIS IS A BAD HACK - JUST PLAYING!!!
        let items_by_id = new Map<string, T>;
        for(let [item_id, item] of collection.items_by_id) {
            let item_deep_clone = structuredClone(item);
            this.add_derived_fields_hack(item_deep_clone);
            items_by_id.set(item_id, item_deep_clone);
        }
        //let items_by_id = collection.items_by_id;
        
        // --- Snapshot gets a point-in-time top-level clone of the collections
        //     items_by_id Map.
        this.items_by_id = new Map(items_by_id);
        
        // --- We also make an array of the items, for quicker scans (our usual
        //     access method)
        this.items = [...items_by_id.values()];
    }

    add_derived_fields_hack(item: any) {
    }
}

export class CollectionTransaction<T> {
    snapshot: CollectionSnapshot<T>;
    updates: Update<T>[];
    constructor(snapshot: CollectionSnapshot<T>) {
        this.snapshot = snapshot;
        this.updates = [];
    }

    append(update: Update<T>) {
        this.updates.push(update);
    }

    pre_commit() {
    }

    commit() {
        this.updates.forEach(update => update.commit());
    }
}

export abstract class Update<T> {
    abstract commit(): void;
}

export class InsertDocument<T> extends Update<T> {
    new_doc: T;
    constructor(new_doc: T) {
        super();
        this.new_doc = new_doc;
    }

    commit() {
    }
}

export class ReplaceDocument<T> extends Update<T> {
    from: T;
    to: T;
    constructor(from: T, to: T) {
        super();
        this.from = from;
        this.to = to;
    }

    commit() {
    }
    
}

export class DeleteDocument<T> extends Update<T> {
    doc: T;
    
    constructor(doc: T) {
        super();
        this.doc = doc;
    }

    commit() {
    }
}

/**
 * Given a collection root dir path, loads all the .toml files from a standard
 * 2 level (cluster, entry) dir structure.
 *
 * Returns an array of tuples: (filename, parsed_toml)[].
 *
 * Higher level functions will confirm that the id is appropriate for
 * the cluster, add the id to the toml data and so on - this raw
 * version is provided separately because it may be useful for things
 * like recovery processing when you don't want the rules enforced.
 */
export async function load_collection_raw(collection_root_dir: string): Promise<[string, any][]> {
    const entry_dirs = await get_entity_dirs(collection_root_dir);
    return Promise.all(entry_dirs.map(entry_dir =>
        load_toml_file(`${entry_dir}/data.toml`)));
}

/**
 * Loads and parses a toml file, and returns the filename and the parsed toml.
 *
 * We may eventually implement a cache using JSON versions of a file
 * in a parallel tree (the toml parser is kind of pokey).
 */
export async function load_toml_file(filename: string): Promise<[string, any]> {
    return [filename, parse(await Deno.readTextFile(filename))]; 
}

/**
 * Returns a list of all the directories at depth 2 under the supplied root dir.
 *
 * for example, given a structure:
 *
 * entries/c/cat/...
 * entries/c/club/...
 * entries/d/dog/...
 *
 * This will return ['entries/c/cat', 'entries/c/club', 'entries/d/dog']
 *
 * For some entities, I think we don't want a two level structure.
 *
 * TODO: this probably should be an async iterator.
 */
async function get_entity_dirs(collection_root_dir: string): Promise<string[]> {
    Deno.readDir(collection_root_dir);
    const entry_dirs = [];
    for await (const group_dir of Deno.readDir(collection_root_dir)) {
        for await (const entry_dir of Deno.readDir(`${collection_root_dir}/${group_dir.name}`)) {
            let dir_path = `${collection_root_dir}/${group_dir.name}/${entry_dir.name}`;
            if ((await Deno.stat(dir_path)).isDirectory) {
                entry_dirs.push(dir_path);
            }
        }
    }
    return entry_dirs;
}


