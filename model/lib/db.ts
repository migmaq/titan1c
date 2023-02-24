import { parse, stringify } from "https://deno.land/std@0.177.0/encoding/toml.ts";

export class Db {
    root: string;

    constructor(root: string) {
        this.root = root;
    }
    
    async load() {
        throw new Error('load() not implemented');
    }

    load_demo_data() {
        throw new Error('demo_data_load() not implemented');
    }
}

export class Collection<T> {
    items: T[] = [];
    
    async load(path: string) {
        this.items = await load_items_from_toml(path);
    }

    load_demo_data() {
        this.items = [];
    }
    
}

export class DbTx {
}


export class DbSnapshot {
}

export class CollectionSnapshot<T> {
    items: T[];

    constructor(collection: Collection<T>) {
        this.items = collection.items;
    }
}











async function get_entity_dirs(collection_root_dir: string): Promise<string[]> {
    Deno.readDir(collection_root_dir);
    const entry_dirs = [];
    for await (const group_dir of Deno.readDir(collection_root_dir)) {
        for await (const entry_dir of Deno.readDir(`${collection_root_dir}/${group_dir.name}`)) {
            entry_dirs.push(`${collection_root_dir}/${group_dir.name}/${entry_dir.name}`);
        }
    }
    return entry_dirs;
}

async function convert_entries_to_toml(collection_root_dir: string) {
    const entry_dirs = await get_entity_dirs(collection_root_dir);
    for (const entry_dir of entry_dirs) {
        const json_text = await Deno.readTextFile(`${entry_dir}/entry.json`);
        const json = JSON.parse(json_text);
        const toml_text = stringify(json);
        await Deno.writeTextFile(`${entry_dir}/entry.toml`, toml_text);
    }
}



// Later add dir of each - converting files into attrs???

async function load_entries(collection_root_dir: string): Promise<any> {
    const entry_dirs = await get_entity_dirs(collection_root_dir);
    const entry_jsons = await Promise.all(entry_dirs.map(entry_dir => Deno.readTextFile(`${entry_dir}/entry.json`)));
    const entry_data = entry_jsons.map(json_text => JSON.parse(json_text));
    //console.info(entry_data);
    console.info('entry_jsons', entry_jsons.length);
    return entry_jsons;
}

// XXX kill this any
export async function load_items_from_toml(collection_root_dir: string): Promise<any> {
    const entry_dirs = await get_entity_dirs(collection_root_dir);
    const entry_tomls = await Promise.all(entry_dirs.map(entry_dir => Deno.readTextFile(`${entry_dir}/entry.toml`)));
    const entry_data = entry_tomls.map(toml_text => parse(toml_text));
    //console.info(entry_data);
    console.info('entry_tomls', entry_tomls.length);
    return entry_data;
}

async function main() {
    //console.info(await get_entity_dirs("entries"));
    let start = Date.now();
    for (let i=0; i<10; i++) {
        console.info(i);
        const entries = await load_items_from_toml("entries");
    }
    let elapsed = Date.now()-start;
    console.info("elapsed", elapsed);
    //console.info(entries.length);
    
}

//await convert_entries_to_toml("entries");
//await main();

