import { parse, stringify } from "https://deno.land/std@0.177.0/encoding/toml.ts";
import { CollectionI } from "./collection.ts";

/**
 * Rename to ProjectData
 */
export abstract class DbData<SnapshotType> {
    root_dir: string;
    current_snapshot: SnapshotType|null = null;
    collections: CollectionI[] = [];

    constructor(root_dir: string) {
        this.root_dir = root_dir;
    }
    
    async load(): Promise<any> {
        return Promise.all(this.collections.map(c=>c.load()));
    }

    snapshot(): SnapshotType {
        if (this.current_snapshot !== null) {
            return this.current_snapshot;
        } else {
            const snapshot = this.snapshot_factory();
            this.current_snapshot = snapshot;
            return snapshot;
        }
    }
    
    abstract snapshot_factory(): SnapshotType;

    /**
     * Commit a transaction.
     * 
     * Note: for this initial implementation, we are using sync IO, and thus this
     * is a sync method.  Long term, we want to be able to run in environments
     * where we cannot use sync methods (for example persisting in the browser) -
     * so this will need to be changed.
     */
    commit(snapshot: SnapshotType, operations: TxOp[]) {
        // --- Confirm preconditions for TX to commit
        // TODO
        // Most Tx,es can be applied at Collection Level.

        // --- Write updates (no 2-phase commit for now - but will add later)
        // We are using sync writes for now to avoid race conditions.
        

        // --- Drop current snapshot (it is out of date)
        this.current_snapshot = null;
    }
}

// Perhaps even against snapshots...
/**
 *
 */
export class TxOp {
    collection: CollectionI;
    constructor(collection: CollectionI) {
        this.collection = collection;
    }
}

export class DeleteOp {
    
}



// async load() {
//     await Promise.all([
//         this.entries.load(this.root_dir+'/entries')]);
//     /*this.categories.load(this.root+'/categories')*/
// }

// snapshot_factory(): DictionarySnapshot {
//     return new DictionarySnapshot(this);
// }

/**
 *
 */

/*
  - Don't want to have to repeat all types for snapshot.
  - edit controls send back before/after copy of data, use diff
  and reapply to redo these changes against a current snap (or reject
  if current snap is not the same as an initial cut).
*/


// export class Transaction {
    
//     constructor(snapshot: DictionarySnapshot) {
//         super(snapshot);
//     }

//     commit() {
        
//     }
// }




/**
 *
 */
export class DbSnapshot<DbType> {
}



/*
  - XXX this is half baked now.
*/
// export class MmoTx extends DbTx {
//     //entry_ops: DbOp<Entry>[] = [],
//     //category_ops: DbOp<Category>[] = [];
// }




// --------------------------------------------------------------------------------
// --- REFACTOR FROM HERE ON DOWN
// --------------------------------------------------------------------------------

// /**
//  * Returns a list of all the directories at depth 2 under the supplied root dir.
//  *
//  * for example, given a structure:
//  *
//  * entries/c/cat/...
//  * entries/c/club/...
//  * entries/d/dog/...
//  *
//  * This will return ['entries/c/cat', 'entries/c/club', 'entries/d/dog']
//  *
//  * For some entities, I think we don't want a two level structure.
//  */
// async function get_entity_dirs(collection_root_dir: string): Promise<string[]> {
//     Deno.readDir(collection_root_dir);
//     const entry_dirs = [];
//     for await (const group_dir of Deno.readDir(collection_root_dir)) {
//         for await (const entry_dir of Deno.readDir(`${collection_root_dir}/${group_dir.name}`)) {
//             let dir_path = `${collection_root_dir}/${group_dir.name}/${entry_dir.name}`;
//             if ((await Deno.stat(dir_path)).isDirectory) {
//                 entry_dirs.push(dir_path);
//             }
//         }
//     }
//     return entry_dirs;
// }

// /**
//  * The python data importer writes .json files for each entry.  This reads all of those
//  * and converts them to toml using our toml representation.
//  *
//  * Should only be used at import time.
//  */
// async function import_entries_from_json_to_toml(collection_root_dir: string, confirmation) {
//     if (confirmation !== 'i-really-mean-to-do-this-and-acknowledge-that-i-may-be-nuking-data')
//         throw new Error('This function is not for you!');
//     const entry_dirs = await get_entity_dirs(collection_root_dir);
//     for (const entry_dir of entry_dirs) {
//         const json_text = await Deno.readTextFile(`${entry_dir}/entry.json`);
//         const json = JSON.parse(json_text);
//         const toml_text = stringify(json);
//         await Deno.writeTextFile(`${entry_dir}/entry.toml`, toml_text);
//     }
// }



// // Later add dir of each - converting files into attrs???

// async function load_entries(collection_root_dir: string): Promise<any> {
//     const entry_dirs = await get_entity_dirs(collection_root_dir);
//     const entry_jsons = await Promise.all(entry_dirs.map(entry_dir => Deno.readTextFile(`${entry_dir}/entry.json`)));
//     const entry_data = entry_jsons.map(json_text => JSON.parse(json_text));
//     //console.info(entry_data);
//     console.info('entry_jsons', entry_jsons.length);
//     return entry_jsons;
// }

// // XXX kill this any
// export async function load_items_from_toml(collection_root_dir: string): Promise<any> {
//     const entry_dirs = await get_entity_dirs(collection_root_dir);
//     const entry_tomls = await Promise.all(entry_dirs.map(entry_dir => Deno.readTextFile(`${entry_dir}/entry.toml`)));
//     const entry_data = entry_tomls.map(toml_text => parse(toml_text));
//     //console.info(entry_data);
//     console.info('entry_tomls', entry_tomls.length);
//     return entry_data;
// }

// async function main() {
//     //console.info(await get_entity_dirs("entries"));
//     let start = Date.now();
//     for (let i=0; i<10; i++) {
//         console.info(i);
//         const entries = await load_items_from_toml("entries");
//     }
//     let elapsed = Date.now()-start;
//     console.info("elapsed", elapsed);
//     //console.info(entries.length);
    
// }

// //await convert_entries_to_toml("entries");
// //await main();

