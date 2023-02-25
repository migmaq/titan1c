import {DbData, DbSnapshot} from './lib/db.ts';
import {EntryCollection, EntrySnapshot} from './entry.ts';
import {CategoryCollection, CategorySnapshot} from './category.ts';

/**
 * A complete load of all the dictionary data.
 *
 * To query the data, call this.snapshot() and then use the query
 * methods on the snapshot.
 */
export class DictionaryData extends DbData<DictionarySnapshot> {
    entries: EntryCollection;
    categories: CategoryCollection;

    /**
     * Instantiates a dictionary project with the dictionary data stored in the
     * supplied folder.
     *
     * You will usually also want to call this.load().
     *
     * (loading is not mixed into the constructor, both because it is
     * seems creepy to do that much IO in a constructor, but also because
     * this.load() must be async)
     */
    constructor(root_dir: string) {
        super(root_dir);
        this.entries = new EntryCollection(root_dir+'/entries');
        this.categories = new CategoryCollection(root_dir+'/categories');
        this.collections = [this.entries, this.categories];
    }

    /**
     * Creates a new dictionary snapshot.
     *
     * It is better to call this.snapshot() rather than this method.
     * this.snapshot() will reuse snapshots until there is an update.
     */
    snapshot_factory(): DictionarySnapshot {
        return new DictionarySnapshot(this);
    }
}

/**
 * A point in time snapshot of the dictionary data.
 *
 * Very cheap to create (the 'documents' in the dictionary data
 * are immutable - so don't need to be copied to create a new snapshot).
 *
 * Using a snapshot instead of reading from the DictionaryData directly
 * provides two benefits:
 *
 * - it provides readers with a consistent view of the data set, even
 *   in the presence of concurrent writers (and the write transactions
 *   are based on top of the snapshot mechanism).
 *
 * - derived indexes - for example 'lexemes by category', or more
 *   complicated indexes that rely on multiple collections can be
 *   created on demand, with no need to update as data changes - they
 *   are created on top of an immutable view of the underlying data
 *   (so after the underlying data changes, then next person to
 *   request a snapshot will get a new one, and new indexes will be
 *   created as needed).
 *
 * The reason this is a concrete class, with typed snapshots per db
 * collection is so that these queries can be implemented on the
 * various snapshot types.
 */
export class DictionarySnapshot extends DbSnapshot<DictionaryData> {
    entries: EntrySnapshot;
    categories: CategorySnapshot;

    constructor(data: DictionaryData) {
        super();
        this.entries = new EntrySnapshot(data.entries);
        this.categories = new CategorySnapshot(data.categories);
    }
}
