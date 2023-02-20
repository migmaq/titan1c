import { ref } from 'vue';
import MySubComponent from './sub-component.js';
import EntryEditor from './entry-editor.js';

const components = { MySubComponent, EntryEditor, };

const template = `
  <div>count is {{ data.count }}</div>
  <button @click="data.count++">INCC</button>
  <button @click="load_word(data, 10001)">LOAD WORD</button>
  <button @click="save_word(data, 10001)">SAVE WORD</button>

  <MySubComponent />

  <h3>EntryEditor</h3>
  <EntryEditor :entryRef="{ref: data.entry }" />
`;

const props = [];
function setup(props) {
    let data = ref({
        count: 0,
        entry: EntryEditor.new_entry(),
    });
    console.info("MySubComponent", MySubComponent);
    return { data, load_word, save_word };
}

// TODO: hoist to be a general load fn.
async function load_word(page, id) {
    console.info('PAGE WAS', page);
    const response = await fetch(`/words/${id}.json`);
    if (!response.ok) {
	throw new Error(`Failed to fetch word ${id} -  ${response.status}`);
    }
    const data = await response.json();
    console.info('GOT DATA', data, typeof data, data._id);
    page.entry = data;
    console.info('PAGE.ENTRY UPDATED to be ', page.entry);
    return data;
}

async function save_word(page, id) {
    const word_json = JSON.stringify(page.entry);
    console.info("WORD JSON IS", word_json);
    const response = await fetch(`/save_word/${id}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: word_json,
    });
    if (!response.ok) {
	throw new Error(`Failed to save word ${id} -  ${response.status}`);
    }
    const data = await response.json();
    console.info('GOT SAVE RESPONSE', data, typeof data, data._id);
    return data;
}

export default {
    components,
    props,
    setup,
    template,
}


