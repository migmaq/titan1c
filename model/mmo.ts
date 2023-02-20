import {Db, DbTx, DbSnapshot} from './model.ts';
import {EntryCollection, EntrySnapshot} from './entry.ts';
import {CategoryCollection, CategorySnapshot} from './category.ts';

// TODO: do a fake load.
// TODO: add snaphot func
// TODO: make load work
// TODO: work on mute.
export class MmoDb extends Db {
    entries: EntryCollection = new EntryCollection();
    categories: CategoryCollection = new CategoryCollection();
    
    async load() {
        await Promise.all([
            this.entries.load(this.root+'/entries')]);
            /*this.categories.load(this.root+'/categories')*/
    }

    load_demo_data() {
        this.entries.load_demo_data();
        this.categories.load_demo_data();
    }

    // TODO: add current snapshot, invalidation etc.
    // TX should 
    snap(): MmoSnapshot {
        return new MmoSnapshot(this);
    }
}

/*
- XXX this is half baked now.
 */
export class MmoTx extends DbTx {
    //entry_ops: DbOp<Entry>[] = [],
    //category_ops: DbOp<Category>[] = [];
}

export class MmoSnapshot extends DbSnapshot {
    entries: EntrySnapshot;
    categories: CategorySnapshot;

    constructor(db: MmoDb) {
        super();
        this.entries = new EntrySnapshot(db.entries);
        this.categories = new CategorySnapshot(db.categories);
    }
}



export class MmoApplication {
    db: MmoDb;

    constructor(db_root: string) {
        this.db = new MmoDb(db_root);
    }

    async init() {
        this.db.load();
    }

    


    
}
