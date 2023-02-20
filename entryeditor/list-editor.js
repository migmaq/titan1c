

const template = `
  <ul>
    <li v-for="item in itemsRef.ref" :key="item._id">
      {{ item.name }} - <slot :item="item"></slot>
    </li>
  </ul>
  <button type="button" @click="itemsRef.ref.push(itemFactory())">NEW</button>
`;

const props = ['itemsRef', 'itemFactory'];
function setup(props) {
    if (!props.itemsRef)
        throw new Error('ListEditor missing itemsRef prop');
    if (!props.itemFactory)
        throw new Error('ListEditor missing itemFactory');
    return {};
}

function new_item_id() {
    return crypto.randomUUID();
}

function find_ref_idx(items, ref_id) {
    return items.findIndex(e => e._id == ref_id);
}

function insert_item_before(items, ref_id, item) {
    insert_item(items, ref_id, item, true);
}

function insert_item_after(items, ref_id, item) {
    console.info('insert_item_after', items, 'ID=', ref_id, 'ITEM=', item);
    insert_item(items, ref_id, item, false);
}

function insert_item(items, ref_id, item, before) {
    if (!ref_id) {
        items.push(item);
    } else {
        console.info("loloking", items, ref_id);
        let ref_idx = find_ref_idx(items, ref_id);
        console.info("ref_idx", ref_idx);
        if (ref_idx == -1) {
            throw new Error("Failed to find reference index for insert");
        }
        items.splice(ref_idx+(before?0:1), 0, item);
    }
}

function move_item_up(items, ref_id) {
    let ref_idx = find_ref_idx(items, ref_id);
    if (ref_idx == -1 || ref_idx<1)
        return;
    items.splice(ref_idx-1, 2, items[ref_idx], items[ref_idx-1]);
}

function move_item_down(items, ref_id) {
    let ref_idx = find_ref_idx(items, ref_id);
    if (ref_idx == -1 || ref_idx+1==items.length)
        return;
    items.splice(ref_idx, 2, items[ref_idx+1], items[ref_idx]);
}

function delete_item(items, ref_id) {
    let ref_idx = find_ref_idx(items, ref_id);
    console.info('delete got refidx', ref_idx);
    if (ref_idx == -1)
        throw new Error("Failed to find item to delete");
    items.splice(ref_idx, 1);
}

const page_fns = {
    insert_item_before,
    insert_item_after,
    insert_item,
    move_item_up,
    move_item_down,
    delete_item,
};

export default {
    components: {},
    props,
    setup,
    template,
}
