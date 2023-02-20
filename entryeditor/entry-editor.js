import { ref } from 'vue';
import ListEditor from './list-editor.js';

const template = `
  <h1>Spellings</h1>
  <ListEditor
        :itemsRef="{ref: entryRef.ref.spelling}"
        :itemFactory="new_entry_spelling"
        v-slot="slot">
        MOO! [[{{slot.item.spelling}}]]
        <input v-model="slot.item.variant">
        <input v-model="slot.item.text">
  </ListEditor>

  <h1>Definitions</h1>
  <ListEditor
        :itemsRef="{ref: entryRef.ref.definitions}"
        :itemFactory="new_entry_definition"
        v-slot="slot">
        <input v-model="slot.item.definition">
  </ListEditor>
  
  <h1>Part of Speech</h1>
  [[{{typeof entryRef}}]]
  <input v-model="entryRef.ref.part_of_speech">

`;

const props = ['entryRef'];
function setup(props) {
    if (!props.entryRef || !props.entryRef.ref) {
        console.info('props are', props, 'ENTRY REF IS', props.entryRef, props.ref, Object.keys(props));
        throw new Error('EntryEditor missing entryRef prop');
    }
    return page_fns;
}

const new_id = () => crypto.randomUUID();

function new_entry_spelling() {
  return {"_id": new_id(), "variant": "", "text": ""};
}

function new_entry_definition() {
  return {"_id": new_id(), "definition": ""};
}

function new_entry_gloss() {
  return {"_id": new_id(), "gloss": ""};
}

function new_entry_example() {
  return {"_id": new_id(), "translation": "", "text": []};
}

function new_entry_examples_text() {
  return {"_id": new_id(), "variant": "", "text": ""};
}

function new_entry_pronunciation_guide() {
  return {"_id": new_id(), "variant": "", "text": ""};
}

function new_entry_alternate_grammatical_form() {
  return {"_id": new_id(), "gloss": "", "grammatical_form": "", "text": []};
}

function new_entry_alternate_grammatical_forms_text() {
  return {"_id": new_id(), "variant": "", "text": ""};
}

function new_entry_category() {
  return {"_id": new_id(), "category": ""};
}

function new_entry_related_entry() {
  return {"_id": new_id(), "unresolved_text": ""};
}

function new_entry_other_regional_form() {
  return {"_id": new_id(), "text": ""};
}

function new_entry_attrs() {
  return {"_id": new_id(), "attr": "", "value": ""};
}

function new_entry_status() {
  return {"_id": new_id(), "variant": "", "status": "", "details": ""};
}
        
function new_entry() {
  return {"_id": new_id(), "spelling": [], "part_of_speech": "", "definitions": [], "glosses": [], "examples": [], "pronunciation_guide": [], "alternate_grammatical_forms": [], "categories": [], "related_entries": [], "other_regional_forms": [], "attrs": [], "internal_note": "", "public_note": "", "status": [], "last_modified_date": ""};
}

const page_fns = {
    new_entry_spelling,
    new_entry_definition,
    new_entry_gloss,
    new_entry_example,
    new_entry_examples_text,
    new_entry_pronunciation_guide,
    new_entry_alternate_grammatical_form,
    new_entry_alternate_grammatical_forms_text,
    new_entry_category,
    new_entry_related_entry,
    new_entry_other_regional_form,
    new_entry_attrs,
    new_entry_status,
    new_entry,
};

export default {
    components: {
        ListEditor,
    },
    new_entry,
    props,
    setup,
    template,
}

