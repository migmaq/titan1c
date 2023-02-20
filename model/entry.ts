import {Collection, CollectionSnapshot} from './model.ts';



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

export interface OrthoText {
    variant: string,
    text: string,
}

interface Definition {
    definition: string,
}

interface Gloss {
    gloss: string,
}

interface Example {
    translation: string,
    text: OrthoText[],
}

export interface AlternateGrammaticalForm {
    gloss: string,
    grammatical_form: string,
    text: OrthoText[],
}

export interface Category {
    category: string,
}

export interface RelatedEntry {
    unresolved_text: string,
}

export interface OtherRegionalForm {
    text: string,
}

export interface OtherAttrs {
    attr: string,
    value: string,
}

export interface Status {
    variant: string,
    status: string,
    details: string,
}

export class EntryCollection extends Collection<Entry> {
    load_demo_data() {
        // this.items = [
        //     {name: 'Henry', width: 7},
        //     {name: 'Barry', width: 12},
        // ];
    }
}

export class EntrySnapshot extends CollectionSnapshot<Entry> {
    items_for_category(category_name: string): Entry[] {
        return this.items.filter(
            i => i.categories.some(c => c.category == category_name))
    }
}

