/**
 * Dictionary data is stored using a restricted version of the JSON data model.
 *
 * The two restrictions are:
 * 
 * - all Objects (dictionaries) have a mandatory 'id' field that is a unique
 *   within the document (but need not be globally unique across the entire system).
 * - arrays contain only Objects (never primitives).
 *
 * Disadvantages:
 *
 * - The id's everywhere are ugly, do make things more verbose, and
 *   make it more difficult to hand-edit a file.  This overhead is
 *   particularly noticeable when the 'child' object has few fields.
 *   Id generation will be particularly onerous when hand editing a
 *   file.
 *
 * Advantages:
 *
 * - Allows for more accurate description of the difference between
 *   two documents.  Without id's if someone changes (for example) a
 *   definition of a word, we cannot distinguish that from deleting a
 *   definition and inserting another one.
 *
 * - Allows any item in the entire dataset to be referenced (for crossreferences
 *   for example) (even though the ids are local to the document, when combined
 *   with the document id, they become globally unique ids).
 * 
 * - Makes things like UI tools easier because the data is more regular.
 *
 * Relational model:
 * 
 * While we have chosen a 'document' format for data sovereignty
 * reasons, the restricted data model can be trivially roundtripped to
 * an equivalent relational model (dicts become tuples, the ids become primary
 * keys (when combined with the document id, a foreign key reference is added to the
 * parent object, and an order field is added).
 *
 * Thinking about the model this way is useful for design discipline.
 *
 * But it also gives the user more options for how to process data.
 * For example, I would like to add a step to the publish process that
 * creates an equivalent SQLite data base file that can be used by
 * researches to do ad-hoc queries (or datalog or whatever).
 */ 

/**
 * Recursively deep freeze a JS object rooted at the supplied root object.
 *
 * After deep freezing, the object will be immutable (deep).
 * 
 * Does not handle reference cycles.
 *
 * From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
export function deepFreeze(object: any) {
    // Freeze properties before freezing self
    for (const name of Reflect.ownKeys(object)) {
        const value = object[name];

        if ((value && typeof value === "object") || typeof value === "function") {
            deepFreeze(value);
        }
    }

    // Freeze self
    return Object.freeze(object);
}

export function find_ref_idx(items: any[], ref_id: any) {
    return items.findIndex(e => e._id == ref_id);
}

export function insert_item_before(items: any[], ref_id: any, item: any) {
    insert_item(items, ref_id, item, true);
}

export function insert_item_after(items: any[], ref_id: any, item: any) {
    console.info('insert_item_after', items, 'ID=', ref_id, 'ITEM=', item);
    insert_item(items, ref_id, item, false);
}

export function insert_item(items: any[], ref_id: any, item: any, before: boolean) {
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

export function move_item_up(items: any[], ref_id: any) {
    let ref_idx = find_ref_idx(items, ref_id);
    if (ref_idx == -1 || ref_idx<1)
        return;
    items.splice(ref_idx-1, 2, items[ref_idx], items[ref_idx-1]);
}

export function move_item_down(items: any[], ref_id: any) {
    let ref_idx = find_ref_idx(items, ref_id);
    if (ref_idx == -1 || ref_idx+1==items.length)
        return;
    items.splice(ref_idx, 2, items[ref_idx+1], items[ref_idx]);
}

export function delete_item(items: any[], ref_id: any) {
    let ref_idx = find_ref_idx(items, ref_id);
    console.info('delete got refidx', ref_idx);
    if (ref_idx == -1)
        throw new Error("Failed to find item to delete");
    items.splice(ref_idx, 1);
}
