import {Collection, CollectionSnapshot} from './lib/collection.ts';
import * as utils from "../utils/utils.ts";

/**
 * Entries
 *
 */
export interface Entry {
    _id: string,
    public_id: string,
    part_of_speech: string,   // switch to enum
    internal_note: string,
    public_note: string,
    last_modified_date: string,

    spellings: OrthoText[],
    definitions: Definition[],
    glosses: Gloss[],
    examples: Example[],

    pronunciation_guide: OrthoText[],
    
    categories: Category[],
    related_entries: RelatedEntry[],

    alternate_grammatical_forms: AlternateGrammaticalForm[],
    other_regional_forms: OtherRegionalForm[],
    other_attrs: OtherAttrs[],
    
    status: Status[],
}

export class CEntry implements Entry {
    _id: string = '';
    public_id: string = '';
    part_of_speech: string = '';   // switch to enum
    internal_note: string = '';
    public_note: string = '';
    last_modified_date: string = '';

    spellings: OrthoText[] = [new COrthoText()];
    definitions: Definition[] = [new CDefinition()];
    glosses: Gloss[] = [new CGloss()];
    examples: Example[] = [new CExample()];

    pronunciation_guide: OrthoText[] = [new COrthoText()];
    
    categories: Category[] = [new CCategory()];
    related_entries: RelatedEntry[] = [new CRelatedEntry()];

    alternate_grammatical_forms: AlternateGrammaticalForm[] = [new CAlternateGrammaticalForm()];
    other_regional_forms: OtherRegionalForm[] = [new COtherRegionalForm()];
    other_attrs: OtherAttrs[] = [new COtherAttrs()];
    
    status: Status[] = [new CStatus()];
}



interface OrthoText {
    variant: string,
    text: string,
}

export class COrthoText implements OrthoText {
    variant: string = '';
    text: string = '';
}

interface Definition {
    definition: string,
}
export class CDefinition implements Definition {
    definition: string = '';
}

interface Gloss {
    gloss: string,
}

export class CGloss implements Gloss {
    gloss: string = ''
}

interface Example {
    translation: string,
    text: OrthoText[],
}

export class CExample implements Example {
    translation: string = '';
    text: OrthoText[] = [new COrthoText()];
}

interface AlternateGrammaticalForm {
    gloss: string,
    grammatical_form: string,
    text: OrthoText[],
}

export class CAlternateGrammaticalForm implements AlternateGrammaticalForm {
    gloss: string ='';
    grammatical_form: string = '';
    text: OrthoText[] = [new COrthoText()];
}

interface Category {
    category: string,
}

export class CCategory implements Category {
    category: string = '';
}

interface RelatedEntry {
    unresolved_text: string,
}
export class CRelatedEntry implements RelatedEntry {
    unresolved_text: string = '';
}

interface OtherRegionalForm {
    text: string,
}

export class COtherRegionalForm implements OtherRegionalForm {
    text: string = '';
}

interface OtherAttrs {
    attr: string,
    value: string,
}

export class COtherAttrs implements OtherAttrs {
    attr: string = '';
    value: string = '';
}

interface Status {
    variant: string,
    status: string,
    details: string,
}
export class CStatus implements Status {
    variant: string = '';
    status: string = '';
    details: string = '';
}

export class EntryCollection extends Collection<Entry> {
    constructor(root_dir: string) {
        super(root_dir)
    }

    make_snapshot(): EntrySnapshot {
        return new EntrySnapshot(this);
    }
}

// TRICKY: Snapshots at this level may well reference other tables (joins).
// we can pass them into the constructor when we need to do that.

// ISSUE: we would like this to be extensible, overridable, our current
//        scheme only works for overriding existing types.  Revist! XXX
//        (and maybe figure out how not to fight javascripts dynamic
//        nature).
// Use proxies to make more stuff avail to templates (we could of
// course offer a .call filter - but that is much more dangerous).
export class EntrySnapshot extends CollectionSnapshot<Entry> {

    constructor(collection: EntryCollection) {
        super(collection);
    }

    // TODO: get @lazy decorator working
    entries_for_category(category_name: string): Entry[] {
        return this.items.filter(
            i => i.categories.some(c => c.category == category_name))
    }

    entries_by_category_id(): Map<string, Entry[]> {
        return utils.multi_partition_by(this.items,
                                        i=>i.categories.map(c=>c.category));
    }
    // TODO: fix typing here - probably should return a recording subitem.
    get default_recording(): string {
        return "XXX";
    }

    // XXX there is a whole snooty mechanism planned for derived fields, but
    //     it is not done yet, and we need some derived fields to render templates,
    //     so we do this temporary hack.
    add_derived_fields_hack(entry: any) {
        entry._name = entry.spelling.map((s:any) => s.text)[0] || 'unnamed';
        entry._gloss_summary = entry.glosses.map((g:any) => g.gloss).join(' / ');
    }
}
