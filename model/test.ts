import {EntryCollection, EntrySnapshot} from "./entry.ts";
import {DictionaryData} from "./dictionary-data.ts";

/*
  - switch to loading DB.
  - rejig snapshot modelling to be per DB, not per collection.
  - this may also affect tx modelling.

  */


async function main_off() {

    const entries = new EntryCollection("/home/dziegler/lexbuilder/entries");
    console.info("loading entries");
    let start = Date.now();
    await entries.load();
    console.info("done loading entries in", Date.now()-start);

    let snap = entries.make_snapshot();

    console.info(snap.entries_for_category("location"));
}

async function main() {

    const dict = new DictionaryData("/home/dziegler/lexbuilder");
    console.time("loading entries");
    await dict.load();
    console.timeEnd("loading entries");

    let snap = dict.snapshot();

    console.info(snap.entries.entries_for_category("location"));
}



await main();
