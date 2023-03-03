import { parse as toml_parse, stringify as toml_stringify } from "https://deno.land/std@0.177.0/encoding/toml.ts";
import {CEntry as Entry} from "./entry.ts";
import {createSchema} from "./schema.ts";


async function round_trip_test(entry_toml_path: string) {
    const entry_toml_text = await Deno.readTextFile(entry_toml_path);
    const entry = toml_parse(entry_toml_text);
    //console.info(toml_stringify(entry));
    console.log(super_toml_stringify(entry));
}

class KeyLists {
    simple_properties : string[] = [];
    empty_arrays : string[] = [];
    arrays : string[] = [];
    spare : string[] = [];
    missing : string[] = [];
}

function key_lister (data : any, template : any) : KeyLists{
    let key_lists = new KeyLists();
    for (const key in template) {    
        if (Array.isArray(template[key])) {
            if (data.hasOwnProperty(key)) {
                if (data[key].length === 0) {
                    key_lists.empty_arrays.push(key);
                }
                else {
                    key_lists.arrays.push(key);                    
                }
            }
            else {
                key_lists.missing.push(key);
            }
        }
        else {
            if (data.hasOwnProperty(key)) {
                key_lists.simple_properties.push(key);
            }
            else {
                key_lists.missing.push(key);
            }

        }
    }

    for (const key in data) {    
        if (!template.hasOwnProperty(key)) {
            key_lists.spare.push(key);
        }
    }
    // console.log(key_lists)
    return key_lists;
}

function super_toml_stringify(data: any): string {
    // console.info(Object.getOwnPropertyNames((new Entry()).categories[0]));
    // console.info(typeof(new Entry()).categories[0]);
    let output = "";

    let schema = createSchema();
    console.log(schema);
    const key_lists = key_lister(data,new Entry());
    // for (const key in data) {    
    const ordered_list = key_lists.simple_properties.concat(key_lists.empty_arrays).concat(key_lists.arrays);
    for (const key of ordered_list) {    
            output = output + toml_stringify_data("",key,data[key],0,false);
    }

    if(key_lists.missing.length > 0) {
        // throw new Error (`Missing properties :"${key_lists.missing}"`);
       console.log(`Missing properties :[${key_lists.missing}]`);

    }
    if(key_lists.spare.length > 0) {
        // throw new Error (`Unexpected properties :"${key_lists.spare}"`);
       console.log(`Unexpected properties :[${key_lists.spare}]`);

    }

    return output;
}

function toml_stringify_array(parent_key: string, key: string, data: any,tabs: number): string {
    const tab = "   ";
    let full_key = key;
    if (parent_key !=="") { full_key = `${parent_key}.${key}` ; }

    if (data.length === 0) {
        // console.info(`${tab.repeat((tabs < 1) ? 0 : tabs-1)}${key} = []`);
        return `${tab.repeat((tabs < 1) ? 0 : tabs-1)}${key} = []\n`;
    }
    else {
        let output = "";
        for (const element of data){
            // console.info(`\n${tab.repeat(tabs)}[[${full_key}]]`);
            output = output + `\n${tab.repeat(tabs)}[[${full_key}]]\n`;
            output = output + toml_stringify_data("",full_key,element,tabs,true);
        }
        return output;
    }
}
function toml_stringify_data(parent_key: string, key: string, data: any,tabs: number,arr: boolean,): string {
    const tab = "   ";
    let type = "";
    let full_key = key;
    if (parent_key !=="") { full_key = `${parent_key}.${key}` ; }
    if (Array.isArray(data)) {
        type = "array";}
    else { type = typeof(data); }
    
    switch (type)
    {
        case "object":
            let output = "";
            for (const curkey in data) {
                output = output + toml_stringify_data(full_key,curkey, data[curkey],tabs+1,arr);
            }
            return output;
            break;
        case "array":
            return toml_stringify_array(parent_key,key,data,tabs);
            break;
        case "string":
            if (arr) {
                tabs--;
                full_key = key
            }
            // console.info(`${tab.repeat(tabs)}${full_key} = ${toml_string(data)}`);
            return `${tab.repeat(tabs)}${full_key} = ${toml_string(data)}\n`;
            break;
        default:
            if (arr) {
                tabs--;
                full_key = key
            }
            // console.info(`${tab.repeat(tabs)}${full_key} = ${data}`);
            return`${tab.repeat(tabs)}${full_key} = ${data}\n`;
    }

    return "";
}

function toml_entry(entry): string {
    
    toml_key_and_value("_id",entry._id,"");   
    toml_key_and_value("public_id",entry.public_id,"");
    toml_key_and_value("part_of_speech",entry.part_of_speech,"");   

    return "";
    
}

function toml_key_and_value (key:string, value:any, indent:string) :string
{
    switch (typeof value) {
        case "string":
            return indent + key + " = " + toml_string(value) + "\n";
        default:
            throw new Error (`Unhandled type ${value}`);
    }
}

function toml_string (text:string): string {
    if (typeof text !== 'string')
        throw new Error (`expected sting, got: "${text}"`);

    if (text.indexOf("'''") !== -1)
        return toml_single_line_string(text);
    else if (text.indexOf("\n") !== -1)
        return toml_multi_line_string(text);
    else
        return toml_single_line_string(text);
}

function toml_single_line_string(text:string): string {
    let newtext = text.replaceAll("\\","\\\\");
    newtext = newtext.replaceAll('"','\\"');
    newtext = newtext.replaceAll("\n","\\\n");
    return '"'+newtext+'"';
}

function toml_multi_line_string(text:string): string {
    if (text.indexOf("'''") !== -1)
        throw new Error (`too many quotes :"${text}"`);
    return "'''" + text + "'''";
}

await round_trip_test("./model/sample-data.toml");
