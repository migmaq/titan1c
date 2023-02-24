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

