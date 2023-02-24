import {DbData, DbSnapshot} from './lib/db.ts';
import {EntryCollection, EntrySnapshot} from './entry.ts';
import {CategoryCollection, CategorySnapshot} from './category.ts';

/**
 *
 */
export class DictionaryData extends DbData<DictionarySnapshot> {
    entries: EntryCollection;
    categories: CategoryCollection;

    constructor(root_dir: string) {
        super(root_dir);
        this.entries = new EntryCollection(root_dir+'/entries');
        this.categories = new CategoryCollection(root_dir+'/categories');
        this.collections = [this.entries, this.categories];
    }

    snapshot_factory(): DictionarySnapshot {
        return new DictionarySnapshot(this);
    }
}

/**
 *
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
